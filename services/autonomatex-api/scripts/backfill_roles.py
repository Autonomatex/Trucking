"""One-off backfill: seed built-in roles for pre-existing tenants and promote
owner users to the OWNER role.

Run from the services/autonomatex-api directory:
    python scripts/backfill_roles.py
"""

from __future__ import annotations

import asyncio
import sys

# Make sure the app package is importable when running as a script.
sys.path.insert(0, ".")

from sqlalchemy import select, text

from app.infrastructure.db.models.tenant import Tenant
from app.infrastructure.db.models.user import Role, User, UserRole
from app.infrastructure.db.session import get_sessionmaker
from app.infrastructure.security.rbac import ROLE_PERMISSIONS, Role as RoleEnum


async def backfill() -> None:
    session_factory = get_sessionmaker()
    async with session_factory() as session:
        # 1. Load all tenants.
        result = await session.execute(select(Tenant))
        tenants = result.scalars().all()
        print(f"Found {len(tenants)} tenant(s): {[t.slug for t in tenants]}")

        for tenant in tenants:
            tid = str(tenant.id)

            # 2. Determine which built-in roles are already present.
            existing = await session.execute(
                select(Role).where(Role.tenant_id == tid)
            )
            existing_names = {r.name for r in existing.scalars().all()}
            print(f"  [{tenant.slug}] existing roles: {existing_names or '(none)'}")

            # 3. Seed any missing roles.
            seeded: dict[str, Role] = {}
            for role_enum, permissions in ROLE_PERMISSIONS.items():
                if role_enum.value in existing_names:
                    # Fetch the already-existing row so we can reference its id.
                    row = await session.execute(
                        select(Role).where(
                            Role.tenant_id == tid, Role.name == role_enum.value
                        )
                    )
                    seeded[role_enum.value] = row.scalar_one()
                    continue

                new_role = Role(
                    tenant_id=tid,
                    name=role_enum.value,
                    permissions=",".join(sorted(p.value for p in permissions)),
                )
                session.add(new_role)
                await session.flush()  # populate id
                seeded[role_enum.value] = new_role
                print(f"  [{tenant.slug}] seeded role: {role_enum.value}")

            # 4. Find users with no role assignment and assign them viewer,
            #    unless their email looks like the provisioned owner — promote those.
            users_result = await session.execute(
                select(User).where(User.tenant_id == tid)
            )
            users = users_result.scalars().all()

            owner_role_id = str(seeded[RoleEnum.OWNER.value].id)
            viewer_role_id = str(seeded[RoleEnum.VIEWER.value].id)

            for user in users:
                uid = str(user.id)
                # Check current assignments.
                ur_result = await session.execute(
                    select(UserRole).where(
                        UserRole.tenant_id == tid, UserRole.user_id == uid
                    )
                )
                current = ur_result.scalars().all()
                current_role_ids = {str(ur.role_id) for ur in current}

                if owner_role_id in current_role_ids:
                    print(f"  [{tenant.slug}] {user.email} already OWNER — skipping")
                    continue

                # Decide target role: owner email pattern gets OWNER, others get VIEWER.
                is_owner_email = user.email.startswith("owner@")
                target_role_id = owner_role_id if is_owner_email else viewer_role_id
                target_role_name = RoleEnum.OWNER.value if is_owner_email else RoleEnum.VIEWER.value

                # Clear existing (likely stale / misassigned) assignments and set target.
                for ur in current:
                    await session.delete(ur)
                session.add(UserRole(tenant_id=tid, user_id=uid, role_id=target_role_id))
                print(f"  [{tenant.slug}] {user.email} → {target_role_name}")

        await session.commit()
        print("\nBackfill complete.")


if __name__ == "__main__":
    asyncio.run(backfill())

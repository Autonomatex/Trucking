"""
Migration drift check.

Runs `alembic check` to verify that the SQLAlchemy models and the applied
Alembic migrations are in sync.  If a developer adds a model column without
generating a migration this test will fail, catching the gap before it reaches
production.

The test spawns `alembic check` as a subprocess so it picks up the real
`alembic.ini` and `env.py` (which configure the live database URL from
`Settings`).  A non-zero exit code means Alembic detected pending changes that
have not been captured in a migration file.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

# Root of the autonomatex-api service (two levels up from this file).
SERVICE_ROOT = Path(__file__).resolve().parents[1]


def test_no_pending_migration_diff() -> None:
    """Fail if `alembic check` detects model/migration drift.

    `alembic check` exits 0 when models match the applied migrations and exits
    1 (with a descriptive message) when it would generate a non-empty
    autogenerate diff.  Any non-zero exit is treated as a failure so that
    errors in the Alembic env itself (e.g. import failures) also surface here.
    """
    result = subprocess.run(
        [sys.executable, "-m", "alembic", "check"],
        cwd=SERVICE_ROOT,
        capture_output=True,
        text=True,
    )

    # Surface stdout/stderr so pytest's -s output (or capsys) makes the diff
    # readable without having to grep log files.
    combined_output = (result.stdout + result.stderr).strip()

    assert result.returncode == 0, (
        "Alembic detected that the SQLAlchemy models are out of sync with the "
        "applied migrations.  Run `alembic revision --autogenerate -m '<description>'` "
        "inside `services/autonomatex-api/` to generate the missing migration, "
        "review the generated file, then commit it.\n\n"
        f"alembic check output:\n{combined_output}"
    )

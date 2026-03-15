import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

const DATA_DIR = path.join(process.cwd(), "data")
export const DB_PATH = path.join(DATA_DIR, "scm.db")

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH)
    _db.pragma("journal_mode = WAL")
    _db.pragma("foreign_keys = ON")
    initSchema(_db)
  }
  return _db
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS equipment (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      created_at  TEXT NOT NULL DEFAULT (date('now'))
    );

    CREATE TABLE IF NOT EXISTS top_level_software (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      equipment_id    INTEGER NOT NULL REFERENCES equipment(id),
      part_number     TEXT NOT NULL,
      version         TEXT NOT NULL,
      name            TEXT NOT NULL,
      description     TEXT NOT NULL DEFAULT '',
      status          TEXT NOT NULL DEFAULT 'DEV' CHECK(status IN ('DEV','REL')),
      created_at      TEXT NOT NULL DEFAULT (date('now'))
    );

    CREATE TABLE IF NOT EXISTS components (
      id                    INTEGER PRIMARY KEY AUTOINCREMENT,
      top_level_software_id INTEGER NOT NULL REFERENCES top_level_software(id),
      part_number           TEXT NOT NULL,
      version               TEXT NOT NULL,
      name                  TEXT NOT NULL,
      repository_url        TEXT NOT NULL DEFAULT '',
      description           TEXT NOT NULL DEFAULT '',
      status                TEXT NOT NULL DEFAULT 'DEV' CHECK(status IN ('DEV','REL')),
      created_at            TEXT NOT NULL DEFAULT (date('now'))
    );

    CREATE TABLE IF NOT EXISTS change_requests (
      id                    INTEGER PRIMARY KEY AUTOINCREMENT,
      cr_number             TEXT NOT NULL UNIQUE,
      title                 TEXT NOT NULL,
      description           TEXT NOT NULL DEFAULT '',
      affected_component_id INTEGER NOT NULL REFERENCES components(id),
      status                TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','in_progress','closed')),
      created_at            TEXT NOT NULL DEFAULT (date('now'))
    );

    CREATE TABLE IF NOT EXISTS component_revisions (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      component_id      INTEGER NOT NULL REFERENCES components(id),
      revision_number   TEXT NOT NULL,
      commit_hash       TEXT NOT NULL DEFAULT '',
      build_artifact    TEXT NOT NULL DEFAULT '',
      change_request_id INTEGER REFERENCES change_requests(id),
      description       TEXT NOT NULL DEFAULT '',
      created_by        TEXT NOT NULL DEFAULT '',
      created_at        TEXT NOT NULL DEFAULT (date('now'))
    );

    CREATE TABLE IF NOT EXISTS software_packages (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      version      TEXT NOT NULL,
      equipment_id INTEGER NOT NULL REFERENCES equipment(id),
      description  TEXT NOT NULL DEFAULT '',
      status       TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','released')),
      created_at   TEXT NOT NULL DEFAULT (date('now'))
    );

    CREATE TABLE IF NOT EXISTS package_contents (
      id                    INTEGER PRIMARY KEY AUTOINCREMENT,
      package_id            INTEGER NOT NULL REFERENCES software_packages(id),
      top_level_software_id INTEGER NOT NULL REFERENCES top_level_software(id),
      component_revision_id INTEGER NOT NULL REFERENCES component_revisions(id)
    );
  `)

  const count = (db.prepare("SELECT COUNT(*) as n FROM equipment").get() as { n: number }).n
  if (count === 0) seedData(db)
}

function seedData(db: Database.Database) {
  db.exec(`
    INSERT INTO equipment (name, description, created_at) VALUES
      ('IFE SERVER', 'In-Flight Entertainment Server', '2024-01-15'),
      ('PRAM', 'Passenger Reading and Media', '2024-02-20');

    INSERT INTO top_level_software (equipment_id, part_number, version, name, description, status, created_at) VALUES
      (1, 'IFE-SW-100', '2.1.0', 'SERVER APPLICATION', '', 'DEV', '2024-01-20'),
      (1, 'IFE-SW-200', '1.3.0', 'MEDIA MANAGER', '', 'REL', '2024-01-25'),
      (2, 'PRAM-SW-100', '3.0.0', 'PRAM APPLICATION', '', 'REL', '2024-02-25'),
      (2, 'PRAM-SW-200', '1.0.2', 'PRAM BOOTLOADER', '', 'REL', '2024-03-01');

    INSERT INTO components (top_level_software_id, part_number, version, name, repository_url, status, created_at) VALUES
      (1, 'IFE-SRV-001', '1.1.0', 'CORE ENGINE',      'https://git.internal/ife/core-engine',     'DEV', '2024-01-22'),
      (1, 'IFE-SRV-002', '1.0.1', 'SESSION MANAGER',  'https://git.internal/ife/session-manager', 'REL', '2024-01-23'),
      (2, 'IFE-MM-001',  '1.3.0', 'VIDEO DECODER',    'https://git.internal/ife/video-decoder',   'REL', '2024-01-26'),
      (2, 'IFE-MM-002',  '1.1.0', 'AUDIO ENGINE',     'https://git.internal/ife/audio-engine',    'REL', '2024-01-27'),
      (3, 'PRAM-APP-001','3.0.0', 'UI FRAMEWORK',     'https://git.internal/pram/ui-framework',   'DEV', '2024-02-26'),
      (3, 'PRAM-APP-002','1.1.0', 'TOUCH HANDLER',    'https://git.internal/pram/touch-handler',  'REL', '2024-02-27'),
      (4, 'PRAM-BL-001', '1.0.2', 'BOOT MANAGER',     'https://git.internal/pram/boot-manager',   'REL', '2024-03-02'),
      (4, 'PRAM-BL-002', '1.0.1', 'FLASH DRIVER',     'https://git.internal/pram/flash-driver',   'REL', '2024-03-03');

    INSERT INTO change_requests (cr_number, title, description, affected_component_id, status, created_at) VALUES
      ('CR-2024-001', 'Core Engine Memory Optimization', 'Optimize memory allocation in the core engine threading model.', 1, 'closed', '2024-02-10'),
      ('CR-2024-002', 'Video Decoder 4K Support',       'Add 4K resolution decode support to the video decoder.', 3, 'closed', '2024-02-25'),
      ('CR-2024-003', 'UI Framework Redesign',          'Overhaul UI framework for improved responsiveness.', 5, 'closed', '2024-03-15'),
      ('CR-2024-004', 'Touch Latency Fix',              'Reduce touch event handling latency for better UX.', 6, 'in_progress', '2024-03-28');

    INSERT INTO component_revisions (component_id, revision_number, commit_hash, build_artifact, change_request_id, description, created_by, created_at) VALUES
      (1, 'v1.0.0', 'a1b2c3d', 'core-engine-1.0.0.bin',    NULL, 'Initial release',           'eng_alpha', '2024-01-22'),
      (1, 'v1.1.0', 'e4f5g6h', 'core-engine-1.1.0.bin',    1,    'Memory optimisation',        'eng_alpha', '2024-02-15'),
      (2, 'v1.0.0', 'i7j8k9l', 'session-mgr-1.0.0.bin',   NULL, 'Initial release',           'eng_beta',  '2024-01-23'),
      (2, 'v1.0.1', 'm1n2o3p', 'session-mgr-1.0.1.bin',   NULL, 'Fixed memory leak',         'eng_beta',  '2024-02-20'),
      (3, 'v1.2.0', 'q4r5s6t', 'video-decoder-1.2.0.bin', NULL, 'Stable release',            'eng_gamma', '2024-01-26'),
      (3, 'v1.3.0', 'u7v8w9x', 'video-decoder-1.3.0.bin', 2,    'Added 4K support',           'eng_gamma', '2024-03-05'),
      (4, 'v1.0.0', 'y1z2a3b', 'audio-engine-1.0.0.bin',  NULL, 'Initial release',           'eng_delta', '2024-01-27'),
      (4, 'v1.1.0', 'c4d5e6f', 'audio-engine-1.1.0.bin',  NULL, 'Improved audio latency',    'eng_delta', '2024-02-28'),
      (5, 'v2.0.0', 'g7h8i9j', 'ui-framework-2.0.0.bin',  NULL, 'Major overhaul',            'eng_zeta',  '2024-02-26'),
      (5, 'v2.1.0', 'k1l2m3n', 'ui-framework-2.1.0.bin',  NULL, 'Animation support',         'eng_zeta',  '2024-03-10'),
      (5, 'v3.0.0', 'o4p5q6r', 'ui-framework-3.0.0.bin',  3,    'Full redesign',              'eng_zeta',  '2024-03-20'),
      (6, 'v1.0.0', 'r1s2t3u', 'touch-handler-1.0.0.bin', NULL, 'Initial release',           'eng_eta',   '2024-02-27'),
      (6, 'v1.1.0', 's7t8u9v', 'touch-handler-1.1.0.bin', 4,    'Touch gesture improvement', 'eng_eta',   '2024-03-12'),
      (7, 'v1.0.1', 'w1x2y3z', 'boot-manager-1.0.1.bin',  NULL, 'Boot sequence fix',         'eng_theta', '2024-03-02'),
      (7, 'v1.0.2', 'a4b5c6d', 'boot-manager-1.0.2.bin',  NULL, 'Checksum fix',              'eng_theta', '2024-03-18'),
      (8, 'v1.0.0', 'e7f8g9h', 'flash-driver-1.0.0.bin',  NULL, 'Initial release',           'eng_iota',  '2024-03-03'),
      (8, 'v1.0.1', 'i1j2k3l', 'flash-driver-1.0.1.bin',  NULL, 'Write reliability fix',     'eng_iota',  '2024-03-20');

    INSERT INTO software_packages (version, equipment_id, description, status, created_at) VALUES
      ('IFE-1.0.0',  1, 'Initial IFE Server release',       'released', '2024-03-01'),
      ('IFE-2.0.0',  1, 'IFE Server with 4K support',       'released', '2024-03-20'),
      ('IFE-2.1.0',  1, 'Latest IFE Server — draft',        'draft',    '2024-04-01'),
      ('PRAM-1.0.0', 2, 'Initial PRAM release',             'released', '2024-03-15'),
      ('PRAM-2.0.0', 2, 'PRAM with boot fixes',             'released', '2024-03-25'),
      ('PRAM-3.0.0', 2, 'Latest PRAM package — draft',      'draft',    '2024-04-05');

    INSERT INTO package_contents (package_id, top_level_software_id, component_revision_id) VALUES
      (1,1,1),(1,1,3),(1,2,5),(1,2,7),
      (2,1,2),(2,1,4),(2,2,6),(2,2,8),
      (3,1,2),(3,1,4),(3,2,6),(3,2,8),
      (4,3,9),(4,3,12),(4,4,14),(4,4,16),
      (5,3,10),(5,3,13),(5,4,15),(5,4,17),
      (6,3,11),(6,3,13),(6,4,15),(6,4,17);
  `)
}

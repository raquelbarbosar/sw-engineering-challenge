CREATE DATABASE bloqit;
CREATE DATABASE e2e_tests;

\c bloqit;

CREATE TABLE "bloq" (
    id UUID NOT NULL,
    title VARCHAR(100) NOT NULL,
    address VARCHAR(250) NOT NULL,
    CONSTRAINT "PK_Bloq" PRIMARY KEY (id)
);

CREATE TABLE "locker" (
    id UUID NOT NULL,
    bloqId UUID NOT NULL,
    status VARCHAR(30) NOT NULL,
    isOccupied BOOLEAN NOT NULL,
    CONSTRAINT "PK_Locker" PRIMARY KEY (id),
    CONSTRAINT "FK_Locker_Bloq" FOREIGN KEY (bloqId) REFERENCES "bloq" (id)
);

CREATE TABLE "rent" (
    id UUID NOT NULL,
    lockerId UUID NULL,
    weight INT NOT NULL,
    size VARCHAR(5) NOT NULL,
    status VARCHAR(30) NOT NULL,
    createdAt TIMESTAMP,
    droppedOffAt TIMESTAMP NULL,
    pickedupAt TIMESTAMP NULL,
    CONSTRAINT "PK_Rent" PRIMARY KEY (id),
    CONSTRAINT "FK_Rent_Locker" FOREIGN KEY (lockerId) REFERENCES "locker" (id)
);

-- Creating Bloqs

INSERT INTO "bloq"(id, title, address) VALUES
('c3ee858c-f3d8-45a3-803d-e080649bbb6f', 'Luitton Vouis Champs Elysées', '101 Av. des Champs-Élysées, 75008 Paris, France');

INSERT INTO "bloq"(id, title, address) VALUES
('484e01be-1570-4ac1-a2a9-02aad3acc54e', 'Riod Eixample', 'Pg. de Gràcia, 74, L''Eixample, 08008 Barcelona, Spain');

INSERT INTO "bloq"(id, title, address) VALUES
('22ffa3c5-3a3d-4f71-81f1-cac18ffbc510', 'Bluberry Regent Street', '121 Regent St, Mayfair, London W1B 4TB, United Kingdom');

-- Creating Locker

INSERT INTO "locker" (id, bloqId, status, isOccupied)
VALUES ('1b8d1e89-2514-4d91-b813-044bf0ce8d20', 'c3ee858c-f3d8-45a3-803d-e080649bbb6f', 'CLOSED', true);

INSERT INTO "locker" (id, bloqId, status, isOccupied)
VALUES ('8b4b59ae-8de5-4322-a426-79c29315a9f1', 'c3ee858c-f3d8-45a3-803d-e080649bbb6f', 'OPEN', false);

INSERT INTO "locker" (id, bloqId, status, isOccupied)
VALUES ('2191e1b5-99c7-45df-8302-998be394be48', 'c3ee858c-f3d8-45a3-803d-e080649bbb6f', 'CLOSED', true);

INSERT INTO "locker" (id, bloqId, status, isOccupied)
VALUES ('6b33b2d1-af38-4b60-a3c5-53a69f70a351', '484e01be-1570-4ac1-a2a9-02aad3acc54e', 'CLOSED', true);

INSERT INTO "locker" (id, bloqId, status, isOccupied)
VALUES ('ea6db2f6-2da7-42ed-9619-d40d718b7bec', '484e01be-1570-4ac1-a2a9-02aad3acc54e', 'CLOSED', false);

INSERT INTO "locker" (id, bloqId, status, isOccupied)
VALUES ('3c881050-54bb-48bb-9d2c-f221d10f876b', '484e01be-1570-4ac1-a2a9-02aad3acc54e', 'OPEN', false);

INSERT INTO "locker" (id, bloqId, status, isOccupied)
VALUES ('3139e8ce-ff98-4cb4-9e00-7f9d8b20e732', '22ffa3c5-3a3d-4f71-81f1-cac18ffbc510', 'OPEN', false);

INSERT INTO "locker" (id, bloqId, status, isOccupied)
VALUES ('75f03ea9-c825-4e76-9484-f8b7f0a1d125', '22ffa3c5-3a3d-4f71-81f1-cac18ffbc510', 'OPEN', false);

INSERT INTO "locker" (id, bloqId, status, isOccupied)
VALUES ('c4705b02-45be-4fd7-8d82-d336df1fa493', '22ffa3c5-3a3d-4f71-81f1-cac18ffbc510', 'CLOSED', false);

-- Creating Rents
INSERT INTO "rent" (id, lockerId, weight, size, status, createdAt)
VALUES ('50be06a8-1dec-4b18-a23c-e98588207752', null, 5, 'M', 'CREATED', NOW());

INSERT INTO "rent" (id, lockerId, weight, size, status, createdAt)
VALUES ('feb72a9a-258d-49c9-92de-f90b1f11984d', '6b33b2d1-af38-4b60-a3c5-53a69f70a351', 30, 'XL', 'DELIVERED', NOW());

INSERT INTO "rent" (id, lockerId, weight, size, status, createdAt)
VALUES ('84ba232e-ce23-4d8f-ae26-68616600df48', '6b33b2d1-af38-4b60-a3c5-53a69f70a351', 10, 'XL', 'WAITING_DROPOFF', NOW());

INSERT INTO "rent" (id, lockerId, weight, size, status, createdAt)
VALUES ('40efc6fd-f10c-4561-88bf-be916613377c', '1b8d1e89-2514-4d91-b813-044bf0ce8d20', 7, 'L', 'WAITING_PICKUP', NOW());

\c e2e_tests;

CREATE TABLE "bloq" (
    id UUID NOT NULL,
    title VARCHAR(100) NOT NULL,
    address VARCHAR(250) NOT NULL,
    CONSTRAINT "PK_Bloq" PRIMARY KEY (id)
);

CREATE TABLE "locker" (
    id UUID NOT NULL,
    bloqId UUID NOT NULL,
    status VARCHAR(30) NOT NULL,
    isOccupied BOOLEAN NOT NULL,
    CONSTRAINT "PK_Locker" PRIMARY KEY (id),
    CONSTRAINT "FK_Locker_Bloq" FOREIGN KEY (bloqId) REFERENCES "bloq" (id)
);

CREATE TABLE "rent" (
    id UUID NOT NULL,
    lockerId UUID NULL,
    weight INT NOT NULL,
    size VARCHAR(5) NOT NULL,
    status VARCHAR(30) NOT NULL,
    createdAt TIMESTAMP,
    droppedOffAt TIMESTAMP NULL,
    pickedupAt TIMESTAMP NULL,
    CONSTRAINT "PK_Rent" PRIMARY KEY (id),
    CONSTRAINT "FK_Rent_Locker" FOREIGN KEY (lockerId) REFERENCES "locker" (id)
);

-- Creating Bloqs

INSERT INTO "bloq"(id, title, address) VALUES
('c3ee858c-f3d8-45a3-803d-e080649bbb6f', 'Luitton Vouis Champs Elysées', '101 Av. des Champs-Élysées, 75008 Paris, France');

INSERT INTO "bloq"(id, title, address) VALUES
('484e01be-1570-4ac1-a2a9-02aad3acc54e', 'Riod Eixample', 'Pg. de Gràcia, 74, L''Eixample, 08008 Barcelona, Spain');

INSERT INTO "bloq"(id, title, address) VALUES
('22ffa3c5-3a3d-4f71-81f1-cac18ffbc510', 'Bluberry Regent Street', '121 Regent St, Mayfair, London W1B 4TB, United Kingdom');

-- Creating Locker

INSERT INTO "locker" (id, bloqId, status, isOccupied)
VALUES ('1b8d1e89-2514-4d91-b813-044bf0ce8d20', 'c3ee858c-f3d8-45a3-803d-e080649bbb6f', 'CLOSED', true);

INSERT INTO "locker" (id, bloqId, status, isOccupied)
VALUES ('8b4b59ae-8de5-4322-a426-79c29315a9f1', 'c3ee858c-f3d8-45a3-803d-e080649bbb6f', 'OPEN', false);

INSERT INTO "locker" (id, bloqId, status, isOccupied)
VALUES ('2191e1b5-99c7-45df-8302-998be394be48', 'c3ee858c-f3d8-45a3-803d-e080649bbb6f', 'CLOSED', true);

INSERT INTO "locker" (id, bloqId, status, isOccupied)
VALUES ('6b33b2d1-af38-4b60-a3c5-53a69f70a351', '484e01be-1570-4ac1-a2a9-02aad3acc54e', 'CLOSED', true);

INSERT INTO "locker" (id, bloqId, status, isOccupied)
VALUES ('ea6db2f6-2da7-42ed-9619-d40d718b7bec', '484e01be-1570-4ac1-a2a9-02aad3acc54e', 'CLOSED', false);

INSERT INTO "locker" (id, bloqId, status, isOccupied)
VALUES ('3c881050-54bb-48bb-9d2c-f221d10f876b', '484e01be-1570-4ac1-a2a9-02aad3acc54e', 'OPEN', false);

INSERT INTO "locker" (id, bloqId, status, isOccupied)
VALUES ('3139e8ce-ff98-4cb4-9e00-7f9d8b20e732', '22ffa3c5-3a3d-4f71-81f1-cac18ffbc510', 'OPEN', false);

INSERT INTO "locker" (id, bloqId, status, isOccupied)
VALUES ('75f03ea9-c825-4e76-9484-f8b7f0a1d125', '22ffa3c5-3a3d-4f71-81f1-cac18ffbc510', 'OPEN', false);

INSERT INTO "locker" (id, bloqId, status, isOccupied)
VALUES ('c4705b02-45be-4fd7-8d82-d336df1fa493', '22ffa3c5-3a3d-4f71-81f1-cac18ffbc510', 'CLOSED', false);

-- Creating Rents
INSERT INTO "rent" (id, lockerId, weight, size, status, createdAt)
VALUES ('50be06a8-1dec-4b18-a23c-e98588207752', null, 5, 'M', 'CREATED', NOW());

INSERT INTO "rent" (id, lockerId, weight, size, status, createdAt)
VALUES ('feb72a9a-258d-49c9-92de-f90b1f11984d', '6b33b2d1-af38-4b60-a3c5-53a69f70a351', 30, 'XL', 'DELIVERED', NOW());

INSERT INTO "rent" (id, lockerId, weight, size, status, createdAt)
VALUES ('84ba232e-ce23-4d8f-ae26-68616600df48', '6b33b2d1-af38-4b60-a3c5-53a69f70a351', 10, 'XL', 'WAITING_DROPOFF', NOW());

INSERT INTO "rent" (id, lockerId, weight, size, status, createdAt)
VALUES ('40efc6fd-f10c-4561-88bf-be916613377c', '1b8d1e89-2514-4d91-b813-044bf0ce8d20', 7, 'L', 'WAITING_PICKUP', NOW());

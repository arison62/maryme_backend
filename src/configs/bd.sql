-- Table VILLE
CREATE TABLE VILLE (
    id_ville INT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
);

-- Table DEPARTEMENT
CREATE TABLE DEPARTEMENT (
    id_departement INT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    id_ville INT NOT NULL,
    FOREIGN KEY (id_ville) REFERENCES VILLE(id_ville)
);

-- Table COMMUNE
CREATE TABLE COMMUNE (
    id_commune INT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    id_departement INT NOT NULL,
    FOREIGN KEY (id_departement) REFERENCES DEPARTEMENT(id_departement)
);

-- Table BANCPUBLICATION
CREATE TABLE BANCPUBLICATION (
    id_banc INT PRIMARY KEY,
    details TEXT,
    id_commune INT NOT NULL,
    FOREIGN KEY (id_commune) REFERENCES COMMUNE(id_commune)
);

-- Table OFFICIEREtatCivil
CREATE TABLE OFFICIEREtatCivil (
    id_officier INT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    id_commune INT NOT NULL,
    FOREIGN KEY (id_commune) REFERENCES COMMUNE(id_commune)
);

-- Table UTILISATEUR
CREATE TABLE UTILISATEUR (
    id_utilisateur INT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

-- Table EPOUX
CREATE TABLE EPOUX (
    id_epoux INT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    date_naissance DATE NOT NULL,
    telephone VARCHAR(20)
);

-- Table EPOUSE
CREATE TABLE EPOUSE (
    id_epouse INT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    date_naissance DATE NOT NULL,
    telephone VARCHAR(20)
);

-- Table CELEBRANT
CREATE TABLE CELEBRANT (
    id_celebrant INT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    date_naissance DATE NOT NULL,
    telephone VARCHAR(20)
);

-- Table TEMOIN
CREATE TABLE TEMOIN (
    id_temoin INT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    date_naissance DATE NOT NULL,
    telephone VARCHAR(20)
);



-- Table DECLARATION
CREATE TABLE DECLARATION (
    id_declaration INT PRIMARY KEY,
    date_declaration DATE NOT NULL,
    statut VARCHAR(50) NOT NULL,
    decision VARCHAR(255),
    id_commune INT NOT NULL,
    id_epoux INT NOT NULL,
    id_epouse INT NOT NULL,
    id_celebrant INT NOT NULL,
    id_utilisateur INT NOT NULL,
    FOREIGN KEY (id_commune) REFERENCES COMMUNE(id_commune),
    FOREIGN KEY (id_epoux) REFERENCES EPOUX(id_epoux),
    FOREIGN KEY (id_epouse) REFERENCES EPOUSE(id_epouse),
    FOREIGN KEY (id_celebrant) REFERENCES CELEBRANT(id_celebrant),
    FOREIGN KEY (id_utilisateur) REFERENCES UTILISATEUR(id_utilisateur)
);

-- Table PUBLICATION_DECLARATION
CREATE TABLE PUBLICATION_DECLARATION (
    id_banc INT PRIMARY KEY,
    id_declaration INT NOT NULL,
    date_publication DATE NOT NULL,
    FOREIGN KEY (id_banc) REFERENCES BANCPUBLICATION(id_banc),
    FOREIGN KEY (id_declaration) REFERENCES DECLARATION(id_declaration)
);

-- Table TRAITEMENT_DECLARATION
CREATE TABLE TRAITEMENT_DECLARATION (
    id_traitement INT PRIMARY KEY,
    date_traitement DATE NOT NULL,
    id_officier INT NOT NULL,
    id_declaration INT NOT NULL,
    FOREIGN KEY (id_officier) REFERENCES OFFICIEREtatCivil(id_officier),
    FOREIGN KEY (id_declaration) REFERENCES DECLARATION(id_declaration)
);



-- Table DECLARATION_TEMOINS
CREATE TABLE DECLARATION_TEMOINS (
    id_declaration INT NOT NULL,
    id_temoin INT NOT NULL,
    PRIMARY KEY (id_declaration, id_temoin),
    FOREIGN KEY (id_declaration) REFERENCES DECLARATION(id_declaration),
    FOREIGN KEY (id_temoin) REFERENCES TEMOIN(id_temoin)
);

-- Table OPPOSITION
CREATE TABLE OPPOSITION (
    id_opposition INT PRIMARY KEY,
    date_opposition DATE NOT NULL,
    motif TEXT,
    id_declaration INT NOT NULL,
    FOREIGN KEY (id_declaration) REFERENCES DECLARATION(id_declaration)
);

-- Table MESSAGE
CREATE TABLE MESSAGE (
    id_message INT PRIMARY KEY,
    date_envoi DATE NOT NULL,
    contenu TEXT NOT NULL,
    type_message VARCHAR(50) NOT NULL,
    id_declaration INT NOT NULL,
    id_officier INT,
    FOREIGN KEY (id_declaration) REFERENCES DECLARATION(id_declaration),
    FOREIGN KEY (id_officier) REFERENCES OFFICIEREtatCivil(id_officier)
);

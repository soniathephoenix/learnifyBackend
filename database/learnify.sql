DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS points_info;
DROP TABLE IF EXISTS login_info;



CREATE TABLE login_info (
    login_id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    username VARCHAR(40) NOT NULL UNIQUE, 
    password VARCHAR(256) NOT NULL,
    PRIMARY KEY(login_id)
);

CREATE TABLE points_info (
    user_id INT,
    username VARCHAR(40) NOT NULL,
    points INT DEFAULT 0,
    level INT DEFAULT 1,
    PRIMARY KEY(user_id),
    FOREIGN KEY(user_id) REFERENCES login_info(login_id)

);

CREATE TABLE questions (
    question_id INT GENERATED ALWAYS AS IDENTITY,
    level INT NOT NULL,
    points_required INT NOT NULL,
    question VARCHAR(200) NOT NULL,
    additional_data VARCHAR(200),
    locals_interviews VARCHAR(200),
    option_a VARCHAR(200) NOT NULL,
    option_b VARCHAR(200) NOT NULL,
    option_c VARCHAR(200) NOT NULL,
    option_d VARCHAR(200) NOT NULL,
    correct_answer VARCHAR(200) NOT NULL,
    PRIMARY KEY(question_id)
);

CREATE TABLE answers (
    answer_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT, 
    question_id INT, 
    correct BOOLEAN NOT NULL,
    PRIMARY KEY(answer_id),
    FOREIGN KEY(user_id) REFERENCES login_info(login_id),
    FOREIGN KEY(question_id) REFERENCES questions(question_id)
);


INSERT INTO login_info (username, password)
VALUES
    ('user1', '123456'),
    ('user2', '1234567');


INSERT INTO points_info (user_id, username, points, level)
VALUES
    (1, 'user1', 1, 2),
    (2, 'user2', 2, 3);



INSERT INTO questions (level, points_required, question, option_a, option_b, option_c, option_d, correct_answer, paper_no)
VALUES
    (1, 0, 'The term CBD would be applied to which of the following?', 'A volcanic eruption', 'The infrastructure of a country', 'A city', 'Renewable energy resources', 'A city', abbreviations),
    (1, 0, 'TNC stands for:', 'Transnational Collaboration','Tertiary Network Challenge','Trident Nuke Carrier','Transnational Corporation', 'Transnational Corporation', abbreviations),
    (1, 0, 'Which of the following is true?', 'LIC stands for Local Index of Communication','An HIC is the opposite of an MEDC','LIC stands for Labour Intensive Community','The opposite of an MEDC is an LIC', 'The opposite of an MEDC is an LIC', abbreviations),
    (1, 0, 'What does the M stand for in IMF?', 'Management', 'Monetary', 'Motoring', 'Madagascar', 'Monetary', abbreviations)
    (1, 0, 'The abbreviation R&D stands for', 'Relief and Disaster', 'Research and Development', 'Rubber and Diesel', 'Response and Delay', 'Research and Development', abbreviations)
    (1, 0, 'The GDP of a country measures what?', 'Its population increase over a ten year period','The erosion of the coastline', 'Its carbon footprint', 'Its economic performance in a given period of time', 'Its economic performance in a given period of time', abbreviations)
    (1, 0, 'The acronym LEDC stands for:', 'Less Economically Developed Country', 'Lower Economically Developed Country', 'Lightly Environmentalised Distant Country', 'Long Evolved Distant Cousin', 'Less Economically Developed Country', abbreviations)
    (1, 0, 'Which is the correct word to describe a person who is involved in preparing maps?', 'Mapper', 'Cartographer', 'Mapsmith', 'Mapographer', Atlases, Ordnance Survey)
    (1, 0, 'Which of the following most accurately describes a map?', 'An accurate representation of the world', 'A representation of part or all of the surface of the Earth', 'A drawing that is used only for navigation', 'A drawing that is used only for navigation', 'A diagram that shows land use in Australia', 'A representation of part or all of the surface of the Earth', Atlases, Ordnance Survey)
    (1, 0, 'Ordnance Survey maps cover ...', 'England', 'The USA', 'the whole world', 'Britain', 'Britain', Atlases, Ordnance Survey)
    (1, 0, 'Which of the following statements most accurately describes an atlas?', 'A collection of maps', 'A list of data about the countries of the world', 'A navigational aid', 'A book containing maps and other geographical data', 'A book containing maps and other geographical data')
    (1, 0, 'An avalanche is ...', 'a gradual movement of a mass of snow towards the coast', 'a slow movement of ices towards a river', 'a rapid movement of snow over flat land','a sudden fast movement of snow down a steep slope', avalanches)
    (1, 0, 'Which of the following is least likely to cause an avalanche?', '')








INSERT INTO answers (user_id, question_id, correct)
VALUES 
    (1, 1, FALSE),
    (1, 2, TRUE),
    (2, 1, TRUE),
    (2, 2, TRUE);















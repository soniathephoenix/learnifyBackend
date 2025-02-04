DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS points_info;
DROP TABLE IF EXISTS login_info;


CREATE TABLE login_info (
    login_id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) NOT NULL,
    surname VARCHAR(50) NOT NULL,
    username VARCHAR(40) NOT NULL UNIQUE, 
    email VARCHAR(320) NOT NULL UNIQUE,
    password VARCHAR(256) NOT NULL,
    PRIMARY KEY(login_id)
);

CREATE TABLE points_info (
    user_id INT NOT NULL,
    points INT DEFAULT 0,
    level INT DEFAULT 1,
    PRIMARY KEY(user_id)
    -- FOREIGN KEY(user_id) REFERENCES login_info(login_id) 
);

CREATE TABLE questions (
    question_id INT GENERATED ALWAYS AS IDENTITY,
    level INT NOT NULL,
    points_required INT NOT NULL,
    question VARCHAR(200) NOT NULL,
    clue VARCHAR(200),
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


INSERT INTO login_info (name, surname, username, email, password)
VALUES
    ('name1', 'surname1', 'user1', 'email1@email','123456'),
    ('name2', 'surname2','user2', 'email2@email', '1234567');


-- INSERT INTO points_info (user_id, points, level)
-- VALUES
--     (1, 1, 2),
--     (2, 2, 3);



INSERT INTO questions (level, points_required, question, clue, option_a, option_b, option_c, option_d, correct_answer)
VALUES
    (1, 0, 'Which one of the following is a natural factor affecting climate change?', '../images/clue1','Agriculture', 'Burning fossil fuels', 'Deforestation', 'Volcanic activity', 'Volcanic activity'),
    (1, 1, 'Which one of the following is a process of erosion in coastal areas?', '../images/clue2', 'Hydraulic power', 'Longshore drift ', 'Rock fall', 'Slumping ', 'Hydraulic power'),
    (1, 2, 'Which word describes the process of erosion when stones collide with each other as they move downstream?', '../images/clue3', 'Abrasion', 'Attrition', 'Hydraulic action', 'Solution', 'Attrition'),
    (1, 3, 'Which statement describes the characteristics of temperate deciduous forests?', '../images/clue4', 'The vegetation is short because the growing season only lasts two months.', 'The trees drop their dead leaves because of lower temperatures in winter.', 'The vegetation is sparse because rainfall is low.', 'The vegetation is evergreen because the climate is hot all year round', 'The trees drop their dead leaves because of lower temperatures in winter.'),
    (1, 4, 'Which measure of development combines income, life expectancy and education levels?', '../images/clue5', 'Gross National Income (GNI) per head', 'Human Development Index (HDI)', 'Infant mortality rate (IMR)', 'People per doctor', 'Human Development Index (HDI)'),
    (1, 5, 'Which city is known as the City of Lions but has no native lions?', NULL, 'Hanoi', 'Bangkok', 'Kuala Lumpur', 'Singapore', 'Singapore');


INSERT INTO answers (user_id, question_id, correct)
VALUES 
    (1, 1, FALSE),
    (1, 2, TRUE),
    (2, 1, TRUE),
    (2, 2, TRUE);




CREATE OR REPLACE FUNCTION auto_insert() 
RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO points_info (user_id, points, level)
        VALUES(NEW.login_id, 0, 1);
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_insert_trigger
AFTER INSERT ON login_info
FOR EACH ROW 
EXECUTE FUNCTION auto_insert();













DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS points_info;
DROP TABLE IF EXISTS login_info;



CREATE TABLE login_info (
    login_id INT GENERATED ALWAYS AS IDENTITY,
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
    question VARCHAR(150) NOT NULL,
    additional_data VARCHAR(150),
    locals_interviews VARCHAR(150),
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



INSERT INTO questions (level, points_required, question, option_a , option_b, option_c, option_d, correct_answer)
VALUES
    (1, 2, 'Which one of the following is a natural factor affecting climate change?', 'Agriculture', 'Burning fossil fuels', 'Deforestation', 'Volcanic activity', 'Volcanic activity'),
    (1, 3, 'Which one of the following is a process of erosion in coastal areas', 'Hydraulic power', 'Longshore drift ', 'Rock fall', 'Slumping ', 'Hydraulic power');


INSERT INTO answers (user_id, question_id, correct)
VALUES 
    (1, 1, FALSE),
    (1, 2, TRUE),
    (2, 1, TRUE),
    (2, 2, TRUE);















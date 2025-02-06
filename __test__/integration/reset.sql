TRUNCATE points_info  RESTART IDENTITY CASCADE;
TRUNCATE answers RESTART IDENTITY CASCADE;
TRUNCATE questions RESTART IDENTITY CASCADE;
TRUNCATE login_info RESTART IDENTITY CASCADE;

INSERT INTO login_info (name, surname, username, email, password)
VALUES  
    ('test1', 'surname', 'username1', 'email1', 'password1'),
    ('test2', 'surname', 'username2', 'email2', 'password2'),
    ('test3', 'surname', 'username3', 'email3', 'password3');

INSERT INTO questions (level, points_required, question, clue, option_a, option_b, option_c, option_d, correct_answer)
VALUES
    (1, 0, 'Q1', '../images/clue1','A1', 'A2', 'A3', 'A4', 'CA1'),
    (1, 1, 'Q2', '../images/clue2','A1', 'A2', 'A3', 'A4', 'CA2');


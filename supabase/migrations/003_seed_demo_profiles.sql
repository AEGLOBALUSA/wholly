-- Seed demo profiles and compatibility scores
-- Generated for 100 demo profiles

BEGIN;

-- Disable foreign key checks temporarily
SET session_replication_role = 'replica';

-- Insert profiles
INSERT INTO profiles (
  id,
  auth_id,
  email,
  first_name,
  age,
  city,
  denomination,
  gender,
  bio,
  photo_url,
  community_familiarity_score,
  is_demo,
  onboarding_complete
) VALUES
(gen_random_uuid(), NULL, 'sarah.mitchell@demo.wholly.app', 'Sarah Mitchell', 26, 'Adelaide City', 'futures-church', 'female', 'Worship team member and fashion designer. Love encountering Jesus in community. Looking for someone ready to serve together.', 'https://randomuser.me/api/portraits/women/59.jpg', 70, TRUE, TRUE),
(gen_random_uuid(), NULL, 'james.chen@demo.wholly.app', 'James Chen', 29, 'Paradise', 'futures-church', 'male', 'Connect group host with a passion for kingdom work. Coffee enthusiast and worship leader wannabe. Believe in radical generosity.', 'https://randomuser.me/api/portraits/men/37.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'emma.thompson@demo.wholly.app', 'Emma Thompson', 31, 'Reynella', 'futures-church', 'female', 'Nurse and intercessor. I pray before coffee. Looking for authentic faith and genuine conversation.', 'https://randomuser.me/api/portraits/women/73.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'marcus.johnson@demo.wholly.app', 'Marcus Johnson', 27, 'Salisbury', 'futures-church', 'male', 'Youth intern and worship musician. In a season of breakthrough. Want someone who loves Jesus more than safety.', 'https://randomuser.me/api/portraits/men/6.jpg', 70, TRUE, TRUE),
(gen_random_uuid(), NULL, 'sophia.rodriguez@demo.wholly.app', 'Sophia Rodriguez', 24, 'Adelaide City', 'futures-church', 'female', 'Graphic designer and connect group member. Passionate about missions and iced lattes. Love being around people with Kingdom vision.', 'https://randomuser.me/api/portraits/women/23.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'ethan.williams@demo.wholly.app', 'Ethan Williams', 33, 'Mount Barker', 'futures-church', 'male', 'Teacher and small group leader. Believe God has big plans. Looking for a genuine partner in faith.', 'https://randomuser.me/api/portraits/men/59.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'olivia.bennett@demo.wholly.app', 'Olivia Bennett', 28, 'Victor Harbor', 'futures-church', 'female', 'Healthcare worker and worship leader. Encounter His presence daily. Values vulnerability and honest prayers.', 'https://randomuser.me/api/portraits/women/91.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'daniel.park@demo.wholly.app', 'Daniel Park', 30, 'Clare Valley', 'futures-church', 'male', 'Software developer and connect group host. Passionate about discipleship and good coffee conversations.', 'https://randomuser.me/api/portraits/men/32.jpg', 50, TRUE, TRUE),
(gen_random_uuid(), NULL, 'jessica.lee@demo.wholly.app', 'Jessica Lee', 25, 'Reynella', 'futures-church', 'female', 'Accountant and worship team. Not afraid to cry at church or pray in public. Looking for radical faith.', 'https://randomuser.me/api/portraits/women/36.jpg', 50, TRUE, TRUE),
(gen_random_uuid(), NULL, 'christopher.brown@demo.wholly.app', 'Christopher Brown', 35, 'Adelaide City', 'futures-church', 'male', 'Pastor and father of vision. Encounter at the core. Want someone serious about following Jesus.', 'https://randomuser.me/api/portraits/men/89.jpg', 70, TRUE, TRUE),
(gen_random_uuid(), NULL, 'amanda.foster@demo.wholly.app', 'Amanda Foster', 27, 'Alpharetta', 'futures-church', 'female', 'Marketing professional and connect group facilitator. Love worship and deep conversations. Faith is my foundation.', 'https://randomuser.me/api/portraits/women/19.jpg', 50, TRUE, TRUE),
(gen_random_uuid(), NULL, 'tyler.morrison@demo.wholly.app', 'Tyler Morrison', 32, 'Gwinnett', 'futures-church', 'male', 'Fitness trainer and worship leader. Believe in presence-driven living. Looking for someone ready for adventure.', 'https://randomuser.me/api/portraits/men/5.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'rachel.green@demo.wholly.app', 'Rachel Green', 26, 'Cobb County', 'futures-church', 'female', 'Teacher and intercessor. Passionate about justice and kingdom work. Love authentic people.', 'https://randomuser.me/api/portraits/women/70.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'andrew.jackson@demo.wholly.app', 'Andrew Jackson', 28, 'Franklin', 'futures-church', 'male', 'Engineer and small group leader. In a season of growth. Want someone who is genuine and faith-filled.', 'https://randomuser.me/api/portraits/men/89.jpg', 70, TRUE, TRUE),
(gen_random_uuid(), NULL, 'victoria.santos@demo.wholly.app', 'Victoria Santos', 29, 'Alpharetta', 'futures-church', 'female', 'Nurse practitioner and worship team. Encounter His love daily. Looking for depth and authenticity.', 'https://randomuser.me/api/portraits/women/2.jpg', 70, TRUE, TRUE),
(gen_random_uuid(), NULL, 'brandon.cole@demo.wholly.app', 'Brandon Cole', 34, 'Gwinnett', 'futures-church', 'male', 'Business owner and connect group host. Passionate about kingdom advancement. Believe in generosity.', 'https://randomuser.me/api/portraits/men/91.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'natalie.rivera@demo.wholly.app', 'Natalie Rivera', 23, 'Cobb County', 'futures-church', 'female', 'Graduate student and worship leader. Believe God moves today. Looking for someone with genuine faith.', 'https://randomuser.me/api/portraits/women/22.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'joshua.hayes@demo.wholly.app', 'Joshua Hayes', 31, 'Franklin', 'futures-church', 'male', 'Audio engineer and worship musician. Love encountering presence in worship. Want a partner in mission.', 'https://randomuser.me/api/portraits/men/26.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'mia.castellano@demo.wholly.app', 'Mia Castellano', 30, 'Alpharetta', 'futures-church', 'female', 'Dance instructor and connect group member. Kingdom passion. Love vulnerability and real conversations.', 'https://randomuser.me/api/portraits/women/88.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'kevin.wu@demo.wholly.app', 'Kevin Wu', 36, 'Cobb County', 'futures-church', 'male', 'IT professional and small group leader. Believe in depth. Looking for authentic connection.', 'https://randomuser.me/api/portraits/men/69.jpg', 50, TRUE, TRUE),
(gen_random_uuid(), NULL, 'isabella.santos@demo.wholly.app', 'Isabella Santos', 27, 'Niterói', 'futures-church', 'female', 'Teacher and worship leader. Passion for missions and encounter. Looking for someone serious about faith.', 'https://randomuser.me/api/portraits/women/22.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'lidia.dias@demo.wholly.app', 'Lidia Dias', 25, 'Niterói', 'futures-church', 'female', 'Social worker and connect group facilitator. Believe in kingdom justice. Want authentic partnership.', 'https://randomuser.me/api/portraits/women/45.jpg', 70, TRUE, TRUE),
(gen_random_uuid(), NULL, 'budi.wijaya@demo.wholly.app', 'Budi Wijaya', 28, 'Solo', 'futures-church', 'male', 'English teacher and worship musician. Passionate about presence. Looking for deep faith conversations.', 'https://randomuser.me/api/portraits/men/41.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'siti.rahman@demo.wholly.app', 'Siti Rahman', 26, 'Solo', 'futures-church', 'female', 'Graphic designer and intercessor. In a season of growth spiritually. Want genuine connection.', 'https://randomuser.me/api/portraits/women/83.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'miguel.torres@demo.wholly.app', 'Miguel Torres', 31, 'Niterói', 'futures-church', 'male', 'Church volunteer and small group leader. Believe in encounter. Want partner in kingdom vision.', 'https://randomuser.me/api/portraits/men/22.jpg', 50, TRUE, TRUE),
(gen_random_uuid(), NULL, 'priya.nair@demo.wholly.app', 'Priya Nair', 30, 'Solo', 'futures-church', 'female', 'Healthcare professional and worship team. Encounter His presence. Looking for authentic faith journey.', 'https://randomuser.me/api/portraits/women/94.jpg', 50, TRUE, TRUE),
(gen_random_uuid(), NULL, 'carolina.silva@demo.wholly.app', 'Carolina Silva', 24, 'Niterói', 'futures-church', 'female', 'College student and connect group member. Believe in radical faith. Looking for someone genuine.', 'https://randomuser.me/api/portraits/women/39.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'andre.costa@demo.wholly.app', 'Andre Costa', 32, 'Niterói', 'futures-church', 'male', 'Manager and small group host. Passionate about discipleship. Want a real partner in faith.', 'https://randomuser.me/api/portraits/men/82.jpg', 50, TRUE, TRUE),
(gen_random_uuid(), NULL, 'anita.kusuma@demo.wholly.app', 'Anita Kusuma', 29, 'Solo', 'futures-church', 'female', 'Yoga instructor turned worship leader. In a season of encounter. Want someone who loves Jesus.', 'https://randomuser.me/api/portraits/women/38.jpg', 70, TRUE, TRUE),
(gen_random_uuid(), NULL, 'lucas.mendes@demo.wholly.app', 'Lucas Mendes', 27, 'Niterói', 'futures-church', 'male', 'Photographer and worship team member. Believe in presence-driven life. Looking for depth.', 'https://randomuser.me/api/portraits/men/81.jpg', 50, TRUE, TRUE),
(gen_random_uuid(), NULL, 'amelia.hayes@demo.wholly.app', 'Amelia Hayes', 28, 'Adelaide City', 'futures-church', 'female', 'Communications specialist and intercessor. Love good conversations and better worship. Want authentic.', 'https://randomuser.me/api/portraits/women/85.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'nathan.clarke@demo.wholly.app', 'Nathan Clarke', 26, 'Paradise', 'futures-church', 'male', 'Financial advisor and worship musician. Believe in surrender. Want someone with real faith.', 'https://randomuser.me/api/portraits/men/82.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'zoe.patterson@demo.wholly.app', 'Zoe Patterson', 32, 'Reynella', 'futures-church', 'female', 'Counselor and connect group facilitator. Passionate about discipleship. Looking for genuine partnership.', 'https://randomuser.me/api/portraits/women/79.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'liam.murphy@demo.wholly.app', 'Liam Murphy', 29, 'Salisbury', 'futures-church', 'male', 'Trade worker and small group leader. Love encounter and community. Want real faith journey.', 'https://randomuser.me/api/portraits/men/92.jpg', 50, TRUE, TRUE),
(gen_random_uuid(), NULL, 'charlotte.west@demo.wholly.app', 'Charlotte West', 25, 'Mount Barker', 'futures-church', 'female', 'Student and worship team. In a season of breakthrough. Looking for authentic connection.', 'https://randomuser.me/api/portraits/women/79.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'royce.mitchell@demo.wholly.app', 'Royce Mitchell', 34, 'Victor Harbor', 'futures-church', 'male', 'Plumber and connect group host. Believe in radical generosity. Want partner in vision.', 'https://randomuser.me/api/portraits/men/12.jpg', 70, TRUE, TRUE),
(gen_random_uuid(), NULL, 'sienna.cross@demo.wholly.app', 'Sienna Cross', 23, 'Clare Valley', 'futures-church', 'female', 'Young professional and worship leader. Believe God moves today. Want genuine faith friend.', 'https://randomuser.me/api/portraits/women/83.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'owen.stewart@demo.wholly.app', 'Owen Stewart', 30, 'Alpharetta', 'futures-church', 'male', 'Healthcare consultant and intercessor. Passionate about kingdom. Looking for authentic person.', 'https://randomuser.me/api/portraits/men/43.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'harper.davis@demo.wholly.app', 'Harper Davis', 27, 'Gwinnett', 'futures-church', 'female', 'Event planner and connect group member. Love worship and community. Want real partner.', 'https://randomuser.me/api/portraits/women/64.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'mason.clark@demo.wholly.app', 'Mason Clark', 35, 'Cobb County', 'futures-church', 'male', 'Business owner and small group leader. Believe in encounter. Want genuine connection.', 'https://randomuser.me/api/portraits/men/42.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'scarlett.anderson@demo.wholly.app', 'Scarlett Anderson', 28, 'Franklin', 'futures-church', 'female', 'Architect and worship team. Passionate about presence. Looking for depth and authenticity.', 'https://randomuser.me/api/portraits/women/76.jpg', 50, TRUE, TRUE),
(gen_random_uuid(), NULL, 'jasper.thompson@demo.wholly.app', 'Jasper Thompson', 31, 'Solo', 'futures-church', 'male', 'Translator and connect group facilitator. In a season of growth. Want real faith conversation.', 'https://randomuser.me/api/portraits/men/43.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'ivy.richardson@demo.wholly.app', 'Ivy Richardson', 24, 'Adelaide City', 'futures-church', 'female', 'Makeup artist and worship leader. Believe in radical faith. Looking for authentic person.', 'https://randomuser.me/api/portraits/women/51.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'forest.jackson@demo.wholly.app', 'Forest Jackson', 33, 'Niterói', 'futures-church', 'male', 'Pastor and father. Passionate about discipleship. Want genuine partner in kingdom work.', 'https://randomuser.me/api/portraits/men/45.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'evelyn.moore@demo.wholly.app', 'Evelyn Moore', 29, 'Paradise', 'futures-church', 'female', 'Fitness coach and intercessor. Love encounter and community. Want real connection.', 'https://randomuser.me/api/portraits/women/7.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'leo.bennett@demo.wholly.app', 'Leo Bennett', 36, 'Reynella', 'futures-church', 'male', 'Construction manager and worship musician. Believe in presence. Want authentic partner.', 'https://randomuser.me/api/portraits/men/41.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'lily.palmer@demo.wholly.app', 'Lily Palmer', 26, 'Salisbury', 'futures-church', 'female', 'Veterinarian and connect group member. Passionate about missions. Looking for genuine faith.', 'https://randomuser.me/api/portraits/women/46.jpg', 50, TRUE, TRUE),
(gen_random_uuid(), NULL, 'samuel.green@demo.wholly.app', 'Samuel Green', 28, 'Mount Barker', 'futures-church', 'male', 'Electrician and small group leader. Love worship and community. Want real partner.', 'https://randomuser.me/api/portraits/men/56.jpg', 50, TRUE, TRUE),
(gen_random_uuid(), NULL, 'grace.noble@demo.wholly.app', 'Grace Noble', 30, 'Victor Harbor', 'futures-church', 'female', 'Photographer and worship leader. In a season of encounter. Want authentic connection.', 'https://randomuser.me/api/portraits/women/10.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'felix.wagner@demo.wholly.app', 'Felix Wagner', 27, 'Clare Valley', 'futures-church', 'male', 'Software engineer and intercessor. Believe in kingdom. Looking for depth and authenticity.', 'https://randomuser.me/api/portraits/men/18.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'jess.watson@demo.wholly.app', 'Jess Watson', 26, 'Melbourne City', 'planetshakers', 'female', 'Accountant and worship team. Love encountering God in the city. Want real faith journey.', 'https://randomuser.me/api/portraits/women/33.jpg', 50, TRUE, TRUE),
(gen_random_uuid(), NULL, 'josh.turner@demo.wholly.app', 'Josh Turner', 31, 'Mill Park', 'planetshakers', 'male', 'Teacher and connect group host. Passionate about presence. Looking for genuine partner.', 'https://randomuser.me/api/portraits/men/49.jpg', 70, TRUE, TRUE),
(gen_random_uuid(), NULL, 'emma.rossi@demo.wholly.app', 'Emma Rossi', 28, 'Lower Plenty', 'planetshakers', 'female', 'Nurse and intercessor. Believe in breakthrough. Looking for someone with real faith.', 'https://randomuser.me/api/portraits/women/16.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'liam.oconnor@demo.wholly.app', 'Liam O''Connor', 29, 'Ringwood', 'planetshakers', 'male', 'Musician and worship leader. In a season of encounter. Want partner in kingdom vision.', 'https://randomuser.me/api/portraits/men/68.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'sophie.davies@demo.wholly.app', 'Sophie Davies', 25, 'Clyde North', 'planetshakers', 'female', 'Designer and worship team member. Love authentic community. Looking for genuine faith.', 'https://randomuser.me/api/portraits/women/84.jpg', 70, TRUE, TRUE),
(gen_random_uuid(), NULL, 'ben.anderson@demo.wholly.app', 'Ben Anderson', 32, 'Melton', 'planetshakers', 'male', 'Small group leader and tradesman. Believe in radical faith. Want real connection.', 'https://randomuser.me/api/portraits/men/88.jpg', 50, TRUE, TRUE),
(gen_random_uuid(), NULL, 'rebecca.hart@demo.wholly.app', 'Rebecca Hart', 27, 'Geelong', 'planetshakers', 'female', 'Healthcare professional and connect group member. Passionate about presence. Want authentic.', 'https://randomuser.me/api/portraits/women/95.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'marcus.lee@demo.wholly.app', 'Marcus Lee', 30, 'Melbourne City', 'planetshakers', 'male', 'IT professional and worship musician. Love encounter and community. Want real partner.', 'https://randomuser.me/api/portraits/men/29.jpg', 70, TRUE, TRUE),
(gen_random_uuid(), NULL, 'alicia.santos@demo.wholly.app', 'Alicia Santos', 24, 'Mill Park', 'planetshakers', 'female', 'Student and worship leader. Believe in radical faith. Want genuine connection.', 'https://randomuser.me/api/portraits/women/43.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'nathan.price@demo.wholly.app', 'Nathan Price', 33, 'Lower Plenty', 'planetshakers', 'male', 'Pastor and discipleship leader. Passionate about kingdom. Want genuine partner.', 'https://randomuser.me/api/portraits/men/77.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'victoria.thompson@demo.wholly.app', 'Victoria Thompson', 28, 'Ringwood', 'planetshakers', 'female', 'Communications specialist and intercessor. Love vulnerable faith. Looking for depth.', 'https://randomuser.me/api/portraits/women/46.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'blake.murphy@demo.wholly.app', 'Blake Murphy', 26, 'Clyde North', 'planetshakers', 'male', 'Personal trainer and worship team. In a season of encounter. Want authentic partner.', 'https://randomuser.me/api/portraits/men/26.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'nora.kennedy@demo.wholly.app', 'Nora Kennedy', 31, 'Melton', 'planetshakers', 'female', 'Counselor and connect group facilitator. Believe in presence. Want real partnership.', 'https://randomuser.me/api/portraits/women/1.jpg', 50, TRUE, TRUE),
(gen_random_uuid(), NULL, 'tyler.walsh@demo.wholly.app', 'Tyler Walsh', 29, 'Geelong', 'planetshakers', 'male', 'Chef and small group leader. Passionate about community. Want genuine faith journey.', 'https://randomuser.me/api/portraits/men/66.jpg', 70, TRUE, TRUE),
(gen_random_uuid(), NULL, 'olivia.cooper@demo.wholly.app', 'Olivia Cooper', 23, 'Melbourne City', 'planetshakers', 'female', 'Young professional and worship leader. Believe in breakthrough. Want authentic faith.', 'https://randomuser.me/api/portraits/women/37.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'adam.rhodes@demo.wholly.app', 'Adam Rhodes', 34, 'Mill Park', 'planetshakers', 'male', 'Business analyst and intercessor. Believe in kingdom vision. Want real connection.', 'https://randomuser.me/api/portraits/men/48.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'zara.lopez@demo.wholly.app', 'Zara Lopez', 27, 'Lower Plenty', 'planetshakers', 'female', 'Marketing professional and worship team. Love encountering presence. Want authentic.', 'https://randomuser.me/api/portraits/women/85.jpg', 70, TRUE, TRUE),
(gen_random_uuid(), NULL, 'ethan.brooks@demo.wholly.app', 'Ethan Brooks', 35, 'Ringwood', 'planetshakers', 'male', 'Project manager and connect group host. Passionate about discipleship. Want genuine partner.', 'https://randomuser.me/api/portraits/men/10.jpg', 50, TRUE, TRUE),
(gen_random_uuid(), NULL, 'scarlett.young@demo.wholly.app', 'Scarlett Young', 30, 'Clyde North', 'planetshakers', 'female', 'Fashion designer and worship leader. In a season of growth. Want real faith conversation.', 'https://randomuser.me/api/portraits/women/1.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'jacob.gray@demo.wholly.app', 'Jacob Gray', 28, 'Melton', 'planetshakers', 'male', 'Software developer and worship team member. Love authentic community. Want real partner.', 'https://randomuser.me/api/portraits/men/4.jpg', 50, TRUE, TRUE),
(gen_random_uuid(), NULL, 'fiona.mckenzie@demo.wholly.app', 'Fiona McKenzie', 26, 'Geelong', 'planetshakers', 'female', 'Physiotherapist and connect group member. Believe in breakthrough. Want authentic faith.', 'https://randomuser.me/api/portraits/women/22.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'lucas.morgan@demo.wholly.app', 'Lucas Morgan', 32, 'Melbourne City', 'planetshakers', 'male', 'Architect and intercessor. Passionate about presence. Looking for genuine connection.', 'https://randomuser.me/api/portraits/men/37.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'heidi.taylor@demo.wholly.app', 'Heidi Taylor', 29, 'Mill Park', 'planetshakers', 'female', 'Psychologist and worship musician. Love encounter and depth. Want authentic partner.', 'https://randomuser.me/api/portraits/women/42.jpg', 70, TRUE, TRUE),
(gen_random_uuid(), NULL, 'owen.bennett@demo.wholly.app', 'Owen Bennett', 36, 'Lower Plenty', 'planetshakers', 'male', 'Finance manager and small group leader. Believe in kingdom. Want real partnership.', 'https://randomuser.me/api/portraits/men/77.jpg', 50, TRUE, TRUE),
(gen_random_uuid(), NULL, 'isla.campbell@demo.wholly.app', 'Isla Campbell', 25, 'Ringwood', 'planetshakers', 'female', 'Teacher and worship leader. In a season of encounter. Looking for genuine faith.', 'https://randomuser.me/api/portraits/women/1.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'kai.lim@demo.wholly.app', 'Kai Lim', 28, 'Singapore', 'planetshakers', 'male', 'Engineer and connect group host. Love worship and community. Want real faith journey.', 'https://randomuser.me/api/portraits/men/25.jpg', 70, TRUE, TRUE),
(gen_random_uuid(), NULL, 'priya.mehta@demo.wholly.app', 'Priya Mehta', 27, 'Singapore', 'planetshakers', 'female', 'Marketing manager and worship team. Believe in presence. Looking for authentic person.', 'https://randomuser.me/api/portraits/women/13.jpg', 70, TRUE, TRUE),
(gen_random_uuid(), NULL, 'thabo.nkosi@demo.wholly.app', 'Thabo Nkosi', 30, 'Cape Town', 'planetshakers', 'male', 'Teacher and intercessor. Passionate about kingdom. Want genuine connection.', 'https://randomuser.me/api/portraits/men/69.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'amara.okonkwo@demo.wholly.app', 'Amara Okonkwo', 26, 'Cape Town', 'planetshakers', 'female', 'Healthcare worker and worship leader. Love encounter. Looking for real faith.', 'https://randomuser.me/api/portraits/women/9.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'ming.chen@demo.wholly.app', 'Ming Chen', 31, 'Singapore', 'planetshakers', 'male', 'Small group leader and professional. Believe in breakthrough. Want real partner.', 'https://randomuser.me/api/portraits/men/7.jpg', 50, TRUE, TRUE),
(gen_random_uuid(), NULL, 'lerato.dlamini@demo.wholly.app', 'Lerato Dlamini', 29, 'Cape Town', 'planetshakers', 'female', 'Accountant and connect group member. Passionate about presence. Want authentic.', 'https://randomuser.me/api/portraits/women/29.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'sophia.chan@demo.wholly.app', 'Sophia Chan', 24, 'Singapore', 'planetshakers', 'female', 'Graduate and worship team. Believe in radical faith. Want genuine connection.', 'https://randomuser.me/api/portraits/women/26.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'kwame.mensah@demo.wholly.app', 'Kwame Mensah', 33, 'Cape Town', 'planetshakers', 'male', 'Pastor and discipleship leader. Passionate about kingdom. Want genuine partner.', 'https://randomuser.me/api/portraits/men/57.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'elena.rodriguez@demo.wholly.app', 'Elena Rodriguez', 25, 'Port Moresby', 'planetshakers', 'female', 'Community worker and worship leader. Love authentic faith. Looking for depth.', 'https://randomuser.me/api/portraits/women/68.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'david.kawa@demo.wholly.app', 'David Kawa', 28, 'Port Moresby', 'planetshakers', 'male', 'Teacher and connect group host. Believe in presence. Want real partnership.', 'https://randomuser.me/api/portraits/men/38.jpg', 70, TRUE, TRUE),
(gen_random_uuid(), NULL, 'jessica.tan@demo.wholly.app', 'Jessica Tan', 30, 'Singapore', 'planetshakers', 'female', 'Nurse and intercessor. Passionate about missions. Want authentic connection.', 'https://randomuser.me/api/portraits/women/85.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'sipho.mthembu@demo.wholly.app', 'Sipho Mthembu', 27, 'Cape Town', 'planetshakers', 'male', 'Designer and worship musician. In a season of encounter. Want genuine faith.', 'https://randomuser.me/api/portraits/men/55.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'marcus.okoro@demo.wholly.app', 'Marcus Okoro', 34, 'Port Moresby', 'planetshakers', 'male', 'Business owner and small group leader. Believe in kingdom vision. Want real partner.', 'https://randomuser.me/api/portraits/men/52.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'rachel.osei@demo.wholly.app', 'Rachel Osei', 23, 'Cape Town', 'planetshakers', 'female', 'Young professional and connect group member. Believe in breakthrough. Want authentic.', 'https://randomuser.me/api/portraits/women/39.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'kevin.teo@demo.wholly.app', 'Kevin Teo', 32, 'Singapore', 'planetshakers', 'male', 'IT director and worship leader. Passionate about presence. Want genuine connection.', 'https://randomuser.me/api/portraits/men/56.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'nadia.mboele@demo.wholly.app', 'Nadia Mboele', 28, 'Cape Town', 'planetshakers', 'female', 'Counselor and worship team. Love encounter and community. Want real partner.', 'https://randomuser.me/api/portraits/women/84.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'aaron.waigani@demo.wholly.app', 'Aaron Waigani', 31, 'Port Moresby', 'planetshakers', 'male', 'Pastor and discipleship leader. Believe in radical faith. Want authentic journey.', 'https://randomuser.me/api/portraits/men/11.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'iris.fujita@demo.wholly.app', 'Iris Fujita', 26, 'Singapore', 'planetshakers', 'female', 'Architect and intercessor. Passionate about presence. Looking for genuine person.', 'https://randomuser.me/api/portraits/women/24.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'levi.mokoena@demo.wholly.app', 'Levi Mokoena', 29, 'Cape Town', 'planetshakers', 'male', 'Fitness instructor and connect group facilitator. Love authentic worship. Want real faith.', 'https://randomuser.me/api/portraits/men/70.jpg', 70, TRUE, TRUE),
(gen_random_uuid(), NULL, 'asha.kumar@demo.wholly.app', 'Asha Kumar', 30, 'Singapore', 'planetshakers', 'female', 'Project manager and worship team member. In a season of growth. Want authentic.', 'https://randomuser.me/api/portraits/women/46.jpg', 70, TRUE, TRUE),
(gen_random_uuid(), NULL, 'xolani.ndlela@demo.wholly.app', 'Xolani Ndlela', 35, 'Cape Town', 'planetshakers', 'male', 'Business consultant and small group leader. Passionate about kingdom. Want genuine partner.', 'https://randomuser.me/api/portraits/men/19.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'bella.munn@demo.wholly.app', 'Bella Munn', 27, 'Port Moresby', 'planetshakers', 'female', 'Educator and worship leader. Believe in breakthrough. Looking for real faith journey.', 'https://randomuser.me/api/portraits/women/45.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'james.naito@demo.wholly.app', 'James Naito', 33, 'Singapore', 'planetshakers', 'male', 'Operations manager and intercessor. Believe in presence-driven life. Want real connection.', 'https://randomuser.me/api/portraits/men/34.jpg', 90, TRUE, TRUE),
(gen_random_uuid(), NULL, 'zainab.hassan@demo.wholly.app', 'Zainab Hassan', 24, 'Cape Town', 'planetshakers', 'female', 'Graduate student and worship team. Believe in radical faith. Want genuine connection.', 'https://randomuser.me/api/portraits/women/35.jpg', 30, TRUE, TRUE),
(gen_random_uuid(), NULL, 'christian.wei@demo.wholly.app', 'Christian Wei', 28, 'Singapore', 'planetshakers', 'male', 'Software engineer and connect group member. Love authentic community. Want real partner.', 'https://randomuser.me/api/portraits/men/56.jpg', 30, TRUE, TRUE);

-- Generate compatibility scores between profiles
-- Create a self-join to calculate scores between all demo profiles
-- Score calculation: (1 - normalized_difference) * 100

WITH profile_pairs AS (
  SELECT
    p1.id as profile_id_1,
    p2.id as profile_id_2,
    ABS(p1.community_familiarity_score - p2.community_familiarity_score) as familiarity_diff
  FROM profiles p1
  JOIN profiles p2 ON p1.id < p2.id
  WHERE p1.is_demo = TRUE AND p2.is_demo = TRUE
)
INSERT INTO compatibility_scores (
  profile_id_1,
  profile_id_2,
  score
)
SELECT
  profile_id_1,
  profile_id_2,
  ROUND(((100 - familiarity_diff) / 100.0) * 100)::integer as score
FROM profile_pairs
ON CONFLICT DO NOTHING;

-- Re-enable foreign key checks
SET session_replication_role = 'origin';

COMMIT;

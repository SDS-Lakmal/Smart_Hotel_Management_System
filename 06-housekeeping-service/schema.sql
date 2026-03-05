CREATE DATABASE IF NOT EXISTS hotel_management;
USE hotel_management;

CREATE TABLE IF NOT EXISTS rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(255) NOT NULL UNIQUE,
    floor INT,
    type VARCHAR(255),
    status VARCHAR(50),
    last_cleaned DATETIME
);

CREATE TABLE IF NOT EXISTS housekeeping_staff (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    shift VARCHAR(255),
    status VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS housekeeping_tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    task_description VARCHAR(255),
    assigned_staff_id BIGINT,
    status VARCHAR(50),
    priority VARCHAR(50),
    created_at DATETIME,
    completed_at DATETIME,
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (assigned_staff_id) REFERENCES housekeeping_staff(id)
);

CREATE TABLE IF NOT EXISTS cleaning_schedule (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    scheduled_date DATE NOT NULL,
    task_id BIGINT,
    status VARCHAR(50),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (task_id) REFERENCES housekeeping_tasks(id)
);

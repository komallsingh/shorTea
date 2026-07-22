
-- USERS TABLE


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- URLS TABLE


CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(20) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    click_count INTEGER DEFAULT 0,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- URL CLICKS TABLE


CREATE TABLE url_clicks (
    id SERIAL PRIMARY KEY,
    url_id INTEGER NOT NULL,
    browser VARCHAR(50),
    os VARCHAR(50),
    device VARCHAR(50),
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_url
        FOREIGN KEY (url_id)
        REFERENCES urls(id)
        ON DELETE CASCADE
);

--INDEXES

CREATE INDEX idx_urls_short_code
ON urls(short_code);

CREATE INDEX idx_urls_user
ON urls(user_id);

CREATE INDEX idx_clicks_url
ON url_clicks(url_id);
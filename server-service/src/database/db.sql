



-- create realtime table
CREATE TABLE public.realtime(
    id SERIAL PRIMARY KEY,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    data JSONB NOT NULL,
    total_size BIGINT NOT NULL DEFAULT 0,
    now_size BIGINT NOT NULL DEFAULT 0
)


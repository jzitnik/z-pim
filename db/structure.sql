
CREATE SCHEMA pim;

CREATE TABLE pim.users (
	user_id serial PRIMARY KEY,
	login varchar NOT NULL UNIQUE,
	password varchar NOT NULL,
	name varchar,
	email varchar,
	role varchar CHECK (role IN ('admin', 'user')), 
	active boolean DEFAULT true
);

CREATE TABLE pim.users_tokens (
	user_id integer NOT NULL,
	token varchar NOT NULL,
	created timestamptz DEFAULT NOW(),
	ip_address varchar,
	CONSTRAINT users_tokens_pkey PRIMARY KEY(user_id, token)
);


CREATE TABLE pim.objects (
	object_id serial PRIMARY KEY,
	user_id integer NOT NULL,
	created timestamptz DEFAULT NOW(),
	name varchar
);
 
 
CREATE TABLE pim.events (
	task_start timestamptz,
	task_end timestamptz,
	description text,
	finished boolean DEFAULT false,
	recurrence integer DEFAULT 0,
	recurrence_interval integer DEFAULT 0
) INHERITS (pim.objects);


CREATE TABLE pim.notes (
	note text
) INHERITS (pim.objects);


CREATE TABLE pim.tasks (
	finished boolean DEFAULT false
) INHERITS (pim.objects);



CREATE TABLE pim.labels (
	name varchar NOT NULL,
	user_id integer NOT NULL,
	color varchar,
	description text,
	CONSTRAINT labels_pkey PRIMARY KEY(name, user_id)
);


CREATE TABLE pim.objects_labels (
	object_id integer NOT NULL,
	label varchar NOT NULL,
	CONSTRAINT objects_labels_pk PRIMARY KEY(object_id, label)
);

CREATE TABLE pim.contacts (
	contact_id serial PRIMARY KEY,
	user_id integer NOT NULL,
	name varchar NOT NULL,
	description text
);

CREATE TABLE pim.contacts_params (
	param_id serial PRIMARY KEY,
	contact_id integer NOT NULL,
	param varchar NOT NULL,
	value varchar
);


CREATE TABLE pim.rss_feeds (
	rss_feed_id serial PRIMARY KEY,
	user_id integer NOT NULL,
	name varchar,
	rss_url text NOT NULL
);

CREATE TABLE pim.imap_accounts (
	imap_account_id serial PRIMARY KEY,
	user_id integer NOT NULL,
	name varchar,
	login varchar NOT NULL,
	password varchar NOT NULL,
	host varchar NOT NULL,
	port integer NOT NULL DEFAULT 443,
	ssl boolean NOT NULL DEFAULT false
);

CREATE TABLE pim.smtp_accounts (
	smtp_account_id serial PRIMARY KEY,
	user_id integer NOT NULL,
	name varchar,
	login varchar NOT NULL,
	password varchar NOT NULL,
	host varchar NOT NULL,
	port integer NOT NULL DEFAULT 443,
	ssl boolean NOT NULL DEFAULT false,
	imap_account_id integer
);

CREATE TABLE pim.settings (
	setting_id serial PRIMARY KEY,
	user_id integer NOT NULL,
	key varchar NOT NULL,
	value text
);

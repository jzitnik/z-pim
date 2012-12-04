 
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
	finished boolean DEFAULT false
) INHERITS (pim.objects);


CREATE TABLE pim.notes (
	note text
) INHERITS (pim.objects);


CREATE TABLE pim.tasks (
	finished boolean DEFAULT false
) INHERITS (pim.objects);



CREATE TABLE pim.objects_flags (
	flag_id integer,
	object_id integer,
	CONSTRAINT objects_flags_pk PRIMARY KEY(flag_id, object_id)
);
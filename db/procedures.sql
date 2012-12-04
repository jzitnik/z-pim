CREATE OR REPLACE FUNCTION pim.assign_label(p_object_id integer, p_label varchar, p_user_id integer)
	RETURNS VOID AS $$
DECLARE
	v_tmp varchar;
	
BEGIN
	SELECT name INTO v_tmp FROM pim.labels WHERE user_id = p_user_id AND name = p_label;
	IF NOT FOUND THEN
		RAISE NOTICE 'NOT FOUND %s', v_tmp;
		INSERT INTO pim.labels (name, user_id) VALUES (p_label, p_user_id);
	END IF;
	
	DELETE FROM pim.objects_labels WHERE object_id = p_object_id AND label = p_label;
	INSERT INTO pim.objects_labels (object_id, label) VALUES (p_object_id, p_label);
	
END;
$$
LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION random_string(length integer) RETURNS text as 
$$
DECLARE
	result varchar;
BEGIN
	SELECT array_to_string(array(
		SELECT substr('abcdefghijklmnopqrstuvwxyz0123456789',
			trunc(random() * 61)::integer + 1, 1)
		FROM generate_series(1, length)), '') INTO result;
	RETURN result;
END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION pim.users_tokens_insert()
	RETURNS TRIGGER AS $$
DECLARE
	v_token varchar;
	v_found boolean;
BEGIN
	LOOP
		SELECT random_string(32) INTO v_token;
		SELECT count(*)::int::boolean INTO v_found FROM pim.users_tokens
		WHERE token = v_token;
		
		EXIT WHEN v_found = false;
	END LOOP;
	NEW.token = v_token;
	RETURN NEW;
END;
$$
LANGUAGE 'plpgsql';


CREATE TRIGGER users_tokens_insert
	BEFORE INSERT
	ON pim.users_tokens
	FOR EACH ROW EXECUTE PROCEDURE pim.users_tokens_insert();

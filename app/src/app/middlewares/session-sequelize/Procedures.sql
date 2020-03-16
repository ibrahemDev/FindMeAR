

call session_get('sdsdfsdfffff',0);
#SHOW PROCEDURE STATUS WHERE name = 'session_get'
drop PROCEDURE if exists session_get;
DELIMITER //
CREATE  PROCEDURE `session_get`(IN in_sid VARCHAR(36), IN unix_time int,IN in_now datetime)
BEGIN

    DECLARE g_data text;
	DECLARE g_expires datetime;
    DECLARE g_lastActivity datetime;
    DECLARE g_createdAt datetime;
    DECLARE g_user_id int unsigned;

    declare last_activity_for_all_session datetime;
    DECLARE is_session_exists int;
    #DECLARE g_now datetime;
    DECLARE g_new_expires datetime;



    DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;
		select
		1 as `isError`,
        0 as `not_found`,
        1 as `unknow`;
	END;


    START TRANSACTION;
    set is_session_exists = 0;


    # set g_now = UTC_TIMESTAMP();

    #set g_now = in_now;#CONVERT_TZ(UTC_TIMESTAMP(),'+00:00',tz);

	set last_activity_for_all_session = null;
	select count(*) into is_session_exists from `sessions` where `sid` = in_sid ;








    if(is_session_exists = 0) then
		COMMIT;
		select
		1 as `isError`,
        1 as `not_found`,
        0 as `unknow`;

    else

		select `user_id`,`data`,`expires`,`last_activity`,`created_at` into g_user_id, g_data, g_expires, g_lastActivity, g_createdAt from `sessions` where `sid` = in_sid ;

		if(in_now < g_expires) then


			if(unix_time > 0) then
				set g_new_expires = FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(in_now) + unix_time));
				UPDATE `sessions` SET `expires`= g_new_expires , `last_activity`= in_now  WHERE `sid` = in_sid;
			else
				UPDATE `sessions` SET  `last_activity`= in_now  WHERE `sid` = in_sid;
				set g_new_expires = g_expires;
			end if;

            if g_user_id is not null then
				#set g_user_id = 0;


                select `last_activity` into last_activity_for_all_session from `sessions` where `user_id` =  g_user_id ORDER by `last_activity` DESC limit 1;


            end if;

            COMMIT;

			select
			0 as `isError`,
			0 as `not_found`,
			0 as `unknow`,
            in_sid as `sid`,
            g_user_id as `user_id`,
            g_data as `data`,
            g_new_expires as `expires`,
            in_now as `last_activity`,
            g_createdAt as `created_at`,
            last_activity_for_all_session as `last_activity_for_all_session`;

		else
			DELETE FROM `sessions` WHERE `sid` = in_sid;
			/*
				delete if expired
            */
            COMMIT;
			select
			1 as `isError`,
			1 as `not_found`,
			0 as `unknow`;
		end if;

    end if;
END //
DELIMITER ;











select count(*)  from `sessions` where `sid` = 'idasdsa' ;
call sss('001');

drop PROCEDURE if exists sss;
DELIMITER //
CREATE  PROCEDURE `sss`(IN _sid VARCHAR(36))
BEGIN
DECLARE is_session_exists int(11);
DECLARE ssid varchar(255);

set @asda := 55;
set ssid = _sid;
set is_session_exists = 0;


select count(*) into is_session_exists from `sessions` where `sid` = 'sssssssssssssss' ;

select is_session_exists;
END //
DELIMITER ;









call session_set("sssssssss","{ssssswwwww}",null,5000000,'');
#SHOW PROCEDURE STATUS WHERE name = 'session_get'
drop PROCEDURE if exists session_set;
DELIMITER //
CREATE  PROCEDURE `session_set`(IN in_sid VARCHAR(36),IN in_data text, IN in_user_id int, IN in_expires text, IN in_now datetime)
proc_label:BEGIN


    DECLARE g_data text;
	DECLARE g_expires datetime;
    DECLARE g_lastActivity datetime;
    DECLARE g_createdAt datetime;
    DECLARE g_user_id int unsigned;



    DECLARE is_user_id_exists int;
    DECLARE is_session_exists int;
    #DECLARE g_now datetime;
    DECLARE g_new_expires datetime;



    #exeption like try catch
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;
		select
		1 as `isError`,
        0 as `not_found`,
        0 as `failed_expires`,
        0 as `failed_args`,
        1 as `unknow`;




	END;

    # simple check for sid session
	if(CHAR_LENGTH(in_sid) > 36 OR CHAR_LENGTH(in_sid) < 1 or in_sid IS NULL) THEN
		select
			1 as `isError`,
            0 as `not_found`,
            0 as `failed_expires`,
            1 as `failed_args`,
			0 as `unknow`;



		LEAVE proc_label;
	END IF;



    START TRANSACTION;

    set is_session_exists = 0;
	#set g_now = in_now; # date now


	if(in_expires >= in_now   ) then


        #check user id
		if in_user_id is not null then
			select count(*) into is_user_id_exists from `users` where id = in_user_id;
			if(is_user_id_exists < 1) then
				set in_user_id = null;
			end if;
		end if;


		# check session
		select count(*) into is_session_exists from `sessions` where `sid` = in_sid ;


		if(is_session_exists < 1) then



			INSERT INTO `sessions`(`sid`, `expires`, `data`, `user_id`, `last_activity`, `created_at`) VALUES (in_sid, in_expires, in_data, in_user_id, in_now, in_now);

			COMMIT;
			select
				0 as `isError`,
				0 as `not_found`,
				0 as `failed_expires`,
				0 as `failed_args`,
				0 as `unknow`,
				in_user_id as `user_id`,
				in_data as `data`,
				in_expires as `expires`,
				in_now as `last_activity`,
				in_now as `created_at`;
		else

			select `user_id`,`data`,`expires`,`last_activity`,`created_at` into g_user_id, g_data, g_expires, g_lastActivity, g_createdAt from `sessions` where `sid` = in_sid ;

			if(g_data = in_data) then
				UPDATE `sessions` SET `user_id` = IF(in_user_id IS NOT NULL AND user_id <> in_user_id , in_user_id, user_id), `last_activity`= in_now WHERE `sid` = in_sid;
				COMMIT;
			else
				UPDATE `sessions` SET `user_id` = IF(in_user_id IS NOT NULL AND user_id <> in_user_id , in_user_id, user_id),  `data` = in_data, `last_activity`= in_now WHERE `sid` = in_sid;
				COMMIT;
			end if;

			select
				0 as `isError`,
				0 as `not_found`,
				0 as `failed_expires`,
				0 as `failed_args`,
				0 as `unknow`,
				in_user_id as `user_id`,
				in_data as `data`,
				in_expires as `expires`,
				in_now as `last_activity`,
				g_createdAt as `created_at`;

		end if;

	else

		ROLLBACK;
		select
        1 as `isError`,
        0 as `not_found`,
        1 as `failed_expires`,
		0 as `failed_args`,
		0 as `unknow`;
    end if;
END //
DELIMITER ;














drop EVENT if exists remove_all_session_expired;

CREATE EVENT `remove_all_session_expired` ON SCHEDULE EVERY 5 SECOND STARTS '2020-02-04 12:34:10' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM `sessions` WHERE `sessions`.`expires` < now();


CREATE EVENT IF NOT EXISTS `remove_all_session_expired`
ON SCHEDULE EVERY 5 SECOND STARTS '2020-02-04 12:34:10'
ON COMPLETION NOT PRESERVE ENABLE
DO DELETE FROM `sessions` WHERE `sessions`.`expires` < now();




CREATE EVENT IF NOT EXISTS test_event_01
ON SCHEDULE AT CURRENT_TIMESTAMP
DO
  INSERT INTO messages(message,created_at)
  VALUES('Test MySQL Event 1',NOW());


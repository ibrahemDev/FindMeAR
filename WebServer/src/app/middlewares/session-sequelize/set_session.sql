
#drop PROCEDURE if exists session_set;
#DELIMITER //
CREATE  PROCEDURE if not exists `session_set` (IN in_sid VARCHAR(36),IN in_data text, IN in_user_id int, IN in_role_id int, IN in_expires text, IN in_now datetime)
proc_label:BEGIN


    DECLARE g_data text;
	DECLARE g_expires datetime;
    DECLARE g_lastActivity datetime;
    DECLARE g_createdAt datetime;
    DECLARE g_user_id int unsigned;



    DECLARE is_user_id_exists int;
    DECLARE is_role_id_exists int;
    DECLARE is_user_has_role int;

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
			else
				select count(*) into is_role_id_exists from `role_users` where `role_id` = in_role_id AND `user_id` = in_user_id ;
					if(is_role_id_exists < 1) then
						set in_role_id = null;
					end if;

			end if;
		end if;


		# check session
		select count(*) into is_session_exists from `sessions` where `sid` = in_sid ;


		if(is_session_exists < 1) then



			INSERT INTO `sessions`(`sid`, `expires`, `data`, `user_id`,`role_id`, `last_activity`, `created_at`) VALUES (in_sid, in_expires, in_data, in_user_id,in_role_id, in_now, in_now);

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
				UPDATE `sessions` SET `user_id` = IF(in_user_id IS NOT NULL AND `user_id` IS NULL , in_user_id, `user_id`), `role_id`= IF(in_role_id IS NOT NULL AND `role_id` IS NULL , in_role_id, `role_id`), `last_activity`= in_now WHERE `sid` = in_sid;
				COMMIT;
			else
				UPDATE `sessions` SET `user_id` = IF(in_user_id IS NOT NULL AND `user_id` IS NULL , in_user_id, `user_id`), `role_id`= IF(in_role_id IS NOT NULL AND `role_id` IS NULL , in_role_id, `role_id`),  `data` = in_data, `last_activity`= in_now WHERE `sid` = in_sid;# in_user_id
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
END ;#//
#DELIMITER ;
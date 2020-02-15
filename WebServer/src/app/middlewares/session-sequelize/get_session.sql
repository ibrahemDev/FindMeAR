
#drop PROCEDURE if exists session_get;
#DELIMITER //

CREATE  PROCEDURE if not exists `session_get`(IN in_sid VARCHAR(36), IN unix_time int,IN in_now datetime)
BEGIN

    DECLARE g_data text;
	DECLARE g_expires datetime;
    DECLARE g_lastActivity datetime;
    DECLARE g_createdAt datetime;
    DECLARE g_user_id int unsigned;
    DECLARE g_role_id int;
	
    
    
    
    declare last_activity_for_all_session datetime;
    DECLARE is_session_exists int;
    #DECLARE g_now datetime;
    DECLARE g_new_expires datetime;
      DECLARE role_id_for_last_activity_for_all_session int;



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

		select `user_id`,`role_id`,`data`,`expires`,`last_activity`,`created_at` into g_user_id, g_role_id, g_data, g_expires, g_lastActivity, g_createdAt from `sessions` where `sid` = in_sid ;

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


                select `last_activity`,`role_id` into last_activity_for_all_session,role_id_for_last_activity_for_all_session from `sessions` where `user_id` =  g_user_id ORDER by `last_activity` DESC limit 1;


            end if;

            COMMIT;

			select
			0 as `isError`,
			0 as `not_found`,
			0 as `unknow`,
            in_sid as `sid`,
            g_user_id as `user_id`,
            g_role_id as `role_id`,
            g_data as `data`,
            g_new_expires as `expires`,
            in_now as `last_activity`,
            g_createdAt as `created_at`;
            #last_activity_for_all_session as `last_activity_for_all_session`,
            #role_id_for_last_activity_for_all_session as `role_id_for_last_activity_for_all_session`

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
END;#//
#DELIMITER ;







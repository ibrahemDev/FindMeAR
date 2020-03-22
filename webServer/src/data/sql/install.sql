

# Here All Sql PROCEDURE For This Project :)
# note: in session PROCEDURES we have many problems :)

DELIMITER //

/***********************************************************************************####****************************************************************************************/
# Start Ai

CREATE  PROCEDURE `ai`(IN in_date1 DATETIME, IN in_date2 DATETIME, IN in_lat DOUBLE, IN in_lon DOUBLE, IN in_distance INT, IN in_houres INT)
BEGIN
	DECLARE now_date1, now_date2 DATETIME;
	DECLARE sum, count INT;




    set now_date1 = in_date1;
	set count = 0;
	set sum = 0;

    WHILE now_date1 < in_date2 DO
		set now_date2 = DATE_ADD(now_date1, INTERVAL in_houres second);
			#now_date1 , now_date2

            call aiGetBetween2Date(now_date1, now_date2, in_lat, in_lon, in_distance, @out_count);
            set count = count + 1;
            set sum = sum + @out_count;
			#select count,sum;

        set now_date1 = now_date2;
    END WHILE;



    select sum/count as `count`;


END;

/***********************************************************************************####****************************************************************************************/

CREATE  PROCEDURE `aiGetBetween2Date`(IN in_date1 DATETIME, IN in_date2 DATETIME, IN in_lat DOUBLE, IN in_lon DOUBLE, IN in_distance INT, OUT out_count INT)
BEGIN

    DECLARE done INT DEFAULT FALSE;
	DECLARE count INT;
	DECLARE f_lat,f_lon double;
    DECLARE f_created_at DATETIME;
    DECLARE emergencies_cur CURSOR FOR select `lat`,`long`,`created_at` from `emergencies` where `created_at` > in_date1  AND `created_at` < in_date2 AND `is_static` is false;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;


	set count = 0;
	OPEN emergencies_cur;
		loop_label:  LOOP
			FETCH emergencies_cur INTO f_lat,f_lon,f_created_at;
			IF done THEN
				LEAVE loop_label;
			END IF;

            call measureLatLon(f_lat, f_lon, in_lat,in_lon, @Meters);
            if @Meters < in_distance then
				set count = count +1;

            end if;
        END LOOP;
	CLOSE emergencies_cur;
    set out_count = count;
END;

/***********************************************************************************####****************************************************************************************/

CREATE  PROCEDURE `measureLatLon`(IN lat1 double, IN lon1 double, IN lat2 double, IN lon2 double, OUT _legth double)
p: BEGIN
	DECLARE R, dLat, dLon,a, c, d double;

    if lat1 is null or lon1 is null or lat2 is null or lon2 is null then
		set _legth = null;
		leave p;
    end if;

    set R = 6378.137;
    set dLat = lat2 * PI() / 180 - lat1 * PI() / 180;
    set dLon = lon2 * PI() / 180 - lon1 * PI() / 180;
    set a = SIN(dLat/2) * SIN(dLat/2) + COS(lat1 * PI() / 180) * COS(lat2 * PI() / 180) * SIN(dLon/2) * SIN(dLon/2);
    set c = 2 *  ATAN2(SQRT(a), SQRT(1-a));
    set d = R * c;
    set _legth = d * 1000;# per meters
END;

/***********************************************************************************####****************************************************************************************/

CREATE  PROCEDURE `generateEmergenciesData`(IN in_length INT, IN in_lat double, IN in_lon double, IN in_distance double, IN in_min_datetime datetime, IN in_max_datetime datetime) BEGIN
		DECLARE  i INT;
		set i = 0;
        SET @MIN = in_min_datetime;
		SET @MAX = in_max_datetime;

        WHILE i < in_length DO
			set @rndate = TIMESTAMPADD(SECOND, FLOOR(RAND() * TIMESTAMPDIFF(SECOND, @MIN, @MAX)), @MIN);
			call pointInCircle(in_lat, in_lon, in_distance, @out_lat, @out_lon);

			INSERT INTO `emergencies` (`id`, `user_id`, `employee_id`, `title`, `description`, `lat`, `long`, `status`, `status_msg`, `is_static`, `created_at`) VALUES (NULL, 1, NULL, 'ffff', 'sssss', @out_lat, @out_lon, '1', NULL, '0', @rndate);


			set i = i + 1;
        END WHILE;


	END;

/***********************************************************************************####****************************************************************************************/

CREATE  PROCEDURE `pointInCircle`(IN in_lat double, IN in_lon double, IN in_distance double, OUT out_lat double, OUT out_lon double) BEGIN
		declare pi,pi2,pi3,rnd1,rnd2,distance ,newLat,newLng,sinLat,cosLat,lat,lng,bearing,theta,sinBearing,cosBearing,sinTheta,cosTheta double;
		declare EARTH_RADIUS int;


        set pi = PI();
        set pi2 = pi+pi;
        set pi3 = pi2+pi;

        set rnd1 = RAND();
        set rnd2 = RAND();
        set EARTH_RADIUS = 6371000;
        set distance = SQRT(rnd1) * in_distance;

        set lat = in_lat * (pi/180);
		set lng = in_lon * (pi/180);
		set sinLat = 	SIN(lat);
		set cosLat = 	COS(lng);

        set bearing = rnd2 * pi2;
	set theta = distance/EARTH_RADIUS;
  set sinBearing = SIN(bearing);
	set cosBearing = 	COS(bearing);
  set sinTheta =SIN(theta);
	set cosTheta = 	COS(theta);



        set newLat = ASIN(sinLat*cosTheta+cosLat*sinTheta*cosBearing);
	set newLng = lng +ATAN2( sinBearing*sinTheta*cosLat, cosTheta-sinLat*SIN(newLat ));
	set newLng = ((newLng+(pi3))%(pi2))-pi;




        set out_lat = newLat * (180/pi);
		set out_lon = newLng * (180/pi);
	END;
    # end Ai
/***********************************************************************************####****************************************************************************************/

# start Session
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
END;

/***********************************************************************************####****************************************************************************************/

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
END ;

/***********************************************************************************####****************************************************************************************/


CREATE EVENT IF NOT EXISTS `remove_all_session_expired`
ON SCHEDULE EVERY 1 DAY STARTS now()
ON COMPLETION NOT PRESERVE ENABLE
DO DELETE FROM `sessions` WHERE `sessions`.`expires` < now();

# END session

/***********************************************************************************####****************************************************************************************/

# start PROCEDURES here respone paramedic to injourd
CREATE  PROCEDURE `getBestParamedicForEmergencie`(IN emergencieLat double, IN emergencieLONG double, OUT out_paramedic_id int)
BEGIN

	DECLARE done INT DEFAULT FALSE;
	DECLARE paramedic_id int;
    DECLARE paramedicLat, paramedicLong double;
    DECLARE Olegth double;
    DECLARE Oparamedic_id int;
    DECLARE is_paramedic_with_emergencie boolean;

	DECLARE paramedics_cur CURSOR FOR select `sessions`.`user_id`, `users`.`lat`,`users`.`long` from
    `sessions`,`users` where `sessions`.`role_id` = 3  AND
    `sessions`.`last_activity` > DATE_SUB(NOW(), INTERVAL 1 MINUTE) AND
    `users`.`id` = `sessions`.`user_id` AND `users`.`is_busy` = false;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    set Olegth = null;
	set Oparamedic_id = null;

    OPEN paramedics_cur;
    loop_label:  LOOP
		FETCH paramedics_cur INTO paramedic_id,paramedicLat,paramedicLong;
		IF done THEN
			LEAVE loop_label;
		END IF;
        select count(*) into is_paramedic_with_emergencie from `emergencies` where `employee_id` = paramedic_id AND `status` = 1;
        if is_paramedic_with_emergencie is false then
			CALL measureLatLon(emergencieLat, emergencieLONG, paramedicLat, paramedicLong,@_legth);
		   if @_legth is not null then
				if @_legth < Olegth OR Olegth is null  then
					set Olegth = @_legth;
					set Oparamedic_id = paramedic_id;
				end if;
		   end if;
        end if;
    END LOOP;
	CLOSE paramedics_cur;
	set out_paramedic_id = Oparamedic_id;

END;

/***********************************************************************************####****************************************************************************************/

CREATE  PROCEDURE `GetAllParamedicsOnlineAndResponeParamedicToEmergencie`()
BEGIN
	DECLARE done INT DEFAULT FALSE;
    DECLARE _emergencie_id int;
    DECLARE _lat, _long double;

	DECLARE str  VARCHAR(255);

    DECLARE emergencies_cur CURSOR FOR select `id`,`lat`,`long` from `emergencies` where employee_id is null AND `status` = 1;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
	OPEN emergencies_cur;
		emergencies_loop_label: LOOP
			FETCH emergencies_cur INTO _emergencie_id, _lat, _long;
			IF done THEN
				LEAVE emergencies_loop_label;
			END IF;

			CALL getBestParamedicForEmergencie(_lat,_long, @out_paramedic_id);
            UPDATE `emergencies` SET `employee_id` = @out_paramedic_id, `status` = 2 WHERE id = _emergencie_id;

        END LOOP;
    CLOSE emergencies_cur;


END;

/***********************************************************************************####****************************************************************************************/


CREATE EVENT IF NOT EXISTS `responeAllParamedicsToAllEmergencies`
ON SCHEDULE EVERY 30 SECOND STARTS now()
ON COMPLETION NOT PRESERVE ENABLE
DO call GetAllParamedicsOnlineAndResponeParamedicToEmergencie();


# END PROCEDURES here respone paramedic to injourd
/***********************************************************************************####****************************************************************************************/

DELIMITER;
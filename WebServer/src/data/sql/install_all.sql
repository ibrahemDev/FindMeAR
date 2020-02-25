



DELIMITER //

/***********************************************************************************####****************************************************************************************/

CREATE  PROCEDURE `aiEmergenciesFetchEmergenciesPerTimeRange`(in _distance INT, in in_min_date_time datetime, IN in_max_date_time datetime)
BEGIN

	DECLARE f_id, chehc_id int;
	DECLARE f_lat,f_long double;
    DECLARE f_created_at timestamp;
	DECLARE done INT DEFAULT FALSE;
	DECLARE emergencies_cur CURSOR FOR select `id`,`lat`,`long`,`created_at` from `emergencies` where `created_at` > in_min_date_time  AND `created_at` < in_max_date_time AND `is_static` is false;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;


    SET FOREIGN_KEY_CHECKS = 0;
    TRUNCATE TABLE `areas` ;
    TRUNCATE TABLE `location_in_areas` ;


    OPEN emergencies_cur;
		loop_label:  LOOP
			FETCH emergencies_cur INTO f_id,f_lat,f_long,f_created_at;
			IF done THEN
				LEAVE loop_label;
			END IF;
			call aiEmergenciesCalculateDistance_BTWN_EmergsAndAreas(_distance, f_lat, f_long, @out_area_id, @distanceMeters);
			if @out_area_id is null then
                INSERT INTO `areas` (`lat`, `long`, `every`, `start_date`, `end_date`,`count`) VALUES (f_lat,f_long,null, in_min_date_time, in_max_date_time,null);
                set chehc_id = LAST_INSERT_ID();
				INSERT INTO `location_in_areas` (`id`, `distance`, `created_at`, `area_id`, `emergency_id`) VALUES (null, 0, f_created_at, chehc_id, f_id);
			else
                INSERT INTO `location_in_areas` (`id`, `distance`, `created_at`, `area_id`, `emergency_id`) VALUES (null, @distanceMeters, f_created_at, @out_area_id, f_id);
            end if;
		END LOOP;

	CLOSE emergencies_cur;
	select 1;
END;

/***********************************************************************************####****************************************************************************************/

CREATE  PROCEDURE `aiEmergenciesCalculateDistance_BTWN_EmergsAndAreas`(in _distance INT,IN in_lat double, IN in_lon double, OUT out_area_id INT, OUT out_metters int)
BEGIN
	DECLARE f_id int;
    DECLARE f_lat,f_long double;
	DECLARE done INT DEFAULT FALSE;
	DECLARE areas_cur CURSOR FOR select `id`,`lat`,`long` from `areas`;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    set out_area_id = null;
	OPEN areas_cur;
		loop_label:  LOOP
			FETCH areas_cur INTO f_id, f_lat, f_long;
			IF done THEN
				LEAVE loop_label;
			END IF;
			call measureLatLon(f_lat,f_long,in_lat,in_lon, @Meters);
            if @Meters < _distance then
				set out_area_id = f_id;
                set out_metters = @Meters;
				LEAVE loop_label;
            end if;
		END LOOP;
	CLOSE areas_cur;
END;

/***********************************************************************************####****************************************************************************************/

CREATE  PROCEDURE `aiEmergenciesCountEmergenciesPerRangeSelectArea`(IN in_every int) BEGIN
	DECLARE f_id, f_every int;
	DECLARE f_start_date, f_end_date datetime;
	DECLARE done INT DEFAULT FALSE;
	DECLARE areas_cur CURSOR FOR select `id`, `every`, `start_date`, `end_date` from `areas`;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

	OPEN areas_cur;
		loop_label:  LOOP
			FETCH areas_cur INTO f_id, f_every, f_start_date, f_end_date;
			IF done THEN
				LEAVE loop_label;
			END IF;
			call aiEmergenciesCountEmergenciesPerRange(f_id, in_every, f_start_date, f_end_date, @count);
			UPDATE `areas` SET `count` = @count, `every` = in_every WHERE `id` = f_id;
		END LOOP;
	CLOSE areas_cur;
	select 1;
END;

/***********************************************************************************####****************************************************************************************/

CREATE  PROCEDURE `aiEmergenciesCountEmergenciesPerRange`(IN in_id INT, In in_every INT, IN in_start_date datetime, IN in_end_date datetime, OUT out_count int) BEGIN

	DECLARE u_start_date, u_end_date,inc datetime;
	DECLARE count, _count, i,u_every INT;
	set i = 0;
	set count = 0;
	set u_start_date = in_start_date;
	set u_end_date = in_end_date;
	set u_every = in_every;

	WHILE u_start_date < in_end_date DO
		set inc = DATE_ADD(u_start_date, INTERVAL in_every second);
		select count(*) into _count  from `location_in_areas` WHERE `area_id` = in_id AND  `created_at` >= u_start_date AND `created_at` <= inc;

		set count = count + _count;
		set i = i + 1;
		set u_start_date = inc;
	END WHILE;

	set out_count = count / i;# averge :)

END;

/***********************************************************************************####****************************************************************************************/

CREATE  PROCEDURE `generateEmergenciesData`(IN in_length INT, IN in_lat double, IN in_lon double, IN in_distance double, IN in_min_datetime datetime, IN in_max_datetime datetime) BEGIN
	DECLARE  i INT;
	set i = 0;
	SET @MIN = in_min_datetime;
	SET @MAX = in_max_datetime;
	WHILE i < in_length DO
		set @rndate = TIMESTAMPADD(SECOND, FLOOR(RAND() * TIMESTAMPDIFF(SECOND, @MIN, @MAX)), @MIN);
		call rndomLocation(in_lat, in_lon, in_distance, @out_lat, @out_lon);
		INSERT INTO `emergencies` (`id`, `user_id`, `employee_id`, `title`, `description`, `lat`, `long`, `status`, `status_msg`, `is_static`, `created_at`) VALUES (NULL, '3', NULL, 'ffff', 'sssss', @out_lat, @out_lon, '1', NULL, '0', @rndate);
		set i = i + 1;

	END WHILE;
END;

/***********************************************************************************####****************************************************************************************/

CREATE  PROCEDURE `rndomLocation`(IN in_lat double, IN in_lon double, IN in_distance double, OUT out_lat double, OUT out_lon double) BEGIN
	declare r, t, w, x, y1, x1, new_lat, new_lon double;

	set r = in_distance / 111300;
	set t = 2 * PI() * RAND();

	set w = r * SQRT(1);
	set x = w * COS(t);

	set y1 = w * SIN(t);
	set x1 = x / COS(in_lat);

	set out_lat = in_lat + y1;
	set out_lon = in_lon + x1;
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
    `sessions`.`last_activity` > DATE_SUB(NOW(), INTERVAL 100000 MINUTE) AND
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
            UPDATE `emergencies` SET `employee_id` = @out_paramedic_id WHERE id = _emergencie_id;

        END LOOP;
    CLOSE emergencies_cur;


END;

/***********************************************************************************####****************************************************************************************/


CREATE EVENT IF NOT EXISTS `responeAllParamedicsToAllEmergencies`
ON SCHEDULE EVERY 30 SECOND STARTS now()
ON COMPLETION NOT PRESERVE ENABLE
DO call GetAllParamedicsOnlineAndResponeParamedicToEmergencie();

/***********************************************************************************####****************************************************************************************/

DELIMITER;
call ai('2020-03-01T00:00','2020-03-05T00:00', 21.53206470098067, 39.841959632741286, 10000, 3600* 12);
drop PROCEDURE if exists ai;
DELIMITER //

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
    
    
END//
DELIMITER ;

drop PROCEDURE if exists aiGetBetween2Date;
DELIMITER //

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
END//
DELIMITER ;


DELIMITER //
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
END//
DELIMITER ;


#############################################################################################################################################333
#call aiEmergenciesFetchEmergenciesPerTimeRange(100,'2020-02-20 00:00:00.000000','2020-02-29 00:00:00.000000');#(60*60*24*3)
call aiEmergenciesFetchEmergenciesPerTimeRange(500,'2020-03-01T00:00','2020-03-05T23:59');

drop PROCEDURE if exists aiEmergenciesFetchEmergenciesPerTimeRange;
DELIMITER //
#distance per maters

CREATE  PROCEDURE `aiEmergenciesFetchEmergenciesPerTimeRange`(in _distance INT, in in_min_date_time datetime, IN in_max_date_time datetime)
BEGIN

	DECLARE f_id, chehc_id int;
	DECLARE f_lat,f_long double;
    DECLARE f_created_at timestamp;
	DECLARE done INT DEFAULT FALSE;

    #in_min_date_time,in_max_date_time
    #DATE_SUB(NOW(), INTERVAL _timeRange SECOND)
	DECLARE emergencies_cur CURSOR FOR select `id`,`lat`,`long`,`created_at` from `emergencies` where `created_at` > in_min_date_time  AND `created_at` < in_max_date_time AND `is_static` is false;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;


    #toDo empty tables
    #for delete all rows in tables
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
           # select * from `areas`,`emergencies` where `emergencies`.`id` = `areas`.``
			if @out_area_id is null then

                INSERT INTO `areas` (`lat`, `long`, `distance`, `every`, `start_date`, `end_date`,`count`) VALUES (f_lat,f_long, _distance,null, in_min_date_time, in_max_date_time,null);
                set chehc_id = LAST_INSERT_ID();
				INSERT INTO `location_in_areas` (`id`, `distance`, `created_at`, `area_id`, `emergency_id`) VALUES (null, 0, f_created_at, chehc_id, f_id);
			else

                INSERT INTO `location_in_areas` (`id`, `distance`, `created_at`, `area_id`, `emergency_id`) VALUES (null, @distanceMeters, f_created_at, @out_area_id, f_id);

            end if;
		END LOOP;

	CLOSE emergencies_cur;

select 'end :)' as `end`;
#`sessions`.`last_activity` > DATE_SUB(NOW(), INTERVAL 100000 MINUTE)

END//
DELIMITER ;










#call aiEmergenciesCalculateDistance_BTWN_EmergsAndAreas(20,lat);

drop PROCEDURE if exists aiEmergenciesCalculateDistance_BTWN_EmergsAndAreas;
DELIMITER //
#distance per maters

CREATE  PROCEDURE `aiEmergenciesCalculateDistance_BTWN_EmergsAndAreas`(in _distance INT,IN in_lat double, IN in_lon double, OUT out_area_id INT, OUT out_metters int)
BEGIN
#measureLatLon(lat1,lon1,lat2,lon2,@out)
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


END//
DELIMITER ;




/**********************************************************************************/
/**********/call aiEmergenciesCountEmergenciesPerRangeSelectArea((60*60 * 12 ));/***************/
/**********************************************************************************/
drop PROCEDURE if exists aiEmergenciesCountEmergenciesPerRangeSelectArea;
DELIMITER //
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
				#select @count;

			END LOOP;
		CLOSE areas_cur;

        select 'end :)' as `end`,@count,f_id;
	END//
DELIMITER ;











drop PROCEDURE if exists aiEmergenciesCountEmergenciesPerRange;
DELIMITER //
	CREATE  PROCEDURE `aiEmergenciesCountEmergenciesPerRange`(IN in_id INT, In in_every INT, IN in_start_date datetime, IN in_end_date datetime, OUT out_count int) BEGIN

        DECLARE u_start_date, u_end_date,inc datetime;
        DECLARE count, _count, i,u_every INT;
        set i = 0;
        set count = 0;

        set u_start_date = in_start_date;
		set u_end_date = in_end_date;
        set u_every = in_every;


        #set out_count = 55;
		WHILE u_start_date < in_end_date DO

			set inc = DATE_ADD(u_start_date, INTERVAL in_every second);

            select count(*) into _count  from `location_in_areas` WHERE `area_id` = in_id AND  `created_at` >= u_start_date AND `created_at` <= inc;


            set count = count + _count;
            set i = i + 1;





            #select inc,u_start_date;
            set u_start_date = inc;
		END WHILE;
		##select count,i;
        #set out_count = u_start_date;
		set out_count = count / i;# averge :)


	END//
DELIMITER ;















# generate data :) for test






drop PROCEDURE if exists rndomLocation;
DELIMITER //
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
	END//
DELIMITER ;






call generateEmergenciesData(300,21.492675, 39.684001,10000,'2020-03-01T00:00','2020-03-02T00:00');
#call generateEmergenciesData(10000,21.492675, 39.684001,5000,'2020-02-20 00:00:00.000000','2020-02-29 00:00:00.000000');
drop PROCEDURE if exists generateEmergenciesData;
DELIMITER //
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


	END//
DELIMITER ;


call pointInCircle(21.492675, 39.684001, 20,@lat, @lon);
select @lat,@lon;

drop PROCEDURE if exists pointInCircle;
DELIMITER //
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
	END//
DELIMITER ;


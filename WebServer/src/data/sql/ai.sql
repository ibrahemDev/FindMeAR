

call aiEmergenciesFetchEmergenciesPerTimeRange(20,'2020-02-20 00:00:00.000000','2020-02-29 00:00:00.000000');#(60*60*24*3)

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
				
                INSERT INTO `areas` (`lat`, `long`, `every`, `start_date`, `end_date`,`count`) VALUES (f_lat,f_long,null, in_min_date_time, in_max_date_time,null);
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
/**********/call aiEmergenciesCountEmergenciesPerRangeSelectArea((60*60 ));/***************/
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

call generateEmergenciesData(5000,21.492675, 39.684001,20,'2020-02-20 00:00:00.000000','2020-02-29 00:00:00.000000');

drop PROCEDURE if exists generateEmergenciesData;
DELIMITER //
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
     
        
	END//
DELIMITER ;


call rndomLocation(21.492675, 39.684001, 20,@lat, @lon);
select @lat,@lon;


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



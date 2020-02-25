

call aiEmergenciesFetchEmergenciesPerTimeRange(20,(60*60*24*3),(60*60));#(60*60*24*3)

drop PROCEDURE if exists aiEmergenciesFetchEmergenciesPerTimeRange;
DELIMITER //
#distance per maters

CREATE  PROCEDURE `aiEmergenciesFetchEmergenciesPerTimeRange`(in _distance INT, in _timeRange INT,IN _timeRangeEvery INT)
BEGIN
	DECLARE f_id, chehc_id int;
	DECLARE f_lat,f_long double;
    DECLARE f_created_at timestamp;
	DECLARE done INT DEFAULT FALSE;
	DECLARE emergencies_cur CURSOR FOR select `id`,`lat`,`long`,`created_at` from `emergencies` where `created_at` > DATE_SUB(NOW(), INTERVAL _timeRange SECOND) AND `is_static` is false;
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
			call aiEmergenciesCalculateDistance_BTWN_EmergsAndAreas(_distance, f_lat, f_long, @out_area_id);
			if @out_area_id is null then
                INSERT INTO `areas` (`lat`, `long`, `every`, `start_date`, `end_date`,`count`) VALUES (f_lat,f_long,_timeRangeEvery, DATE_SUB(NOW(), INTERVAL _timeRange SECOND), now(),null);
                set chehc_id = LAST_INSERT_ID();
				INSERT INTO `location_in_areas` (`id`, `distance`, `created_at`, `area_id`, `emergency_id`) VALUES (null,_distance,f_created_at,chehc_id,f_id);
			else													
            
                INSERT INTO `location_in_areas` (`id`, `distance`, `created_at`, `area_id`, `emergency_id`) VALUES (null,_distance, f_created_at, @out_area_id,f_id);
                
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

CREATE  PROCEDURE `aiEmergenciesCalculateDistance_BTWN_EmergsAndAreas`(in _distance INT,IN in_lat double, IN in_lon double, OUT out_area_id INT)
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
				LEAVE loop_label;
            end if;
            
			
		END LOOP;
   
	CLOSE areas_cur;
	select out_area_id;

END//
DELIMITER ;





call aiEmergenciesCountEmergenciesPerRangeSelectArea();

drop PROCEDURE if exists aiEmergenciesCountEmergenciesPerRangeSelectArea;
DELIMITER //
	CREATE  PROCEDURE `aiEmergenciesCountEmergenciesPerRangeSelectArea`() BEGIN
	

		DECLARE f_id, f_every int;
		DECLARE f_start_date, f_end_date datetime;
		DECLARE done INT DEFAULT FALSE;
		DECLARE areas_cur CURSOR FOR select `id`, `every`, `start_date`, `end_date` from `areas` where `count` is null;
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
        
        OPEN areas_cur;
			loop_label:  LOOP
				FETCH areas_cur INTO f_id, f_every, f_start_date, f_end_date;
				IF done THEN
					LEAVE loop_label;
				END IF;
                
				call aiEmergenciesCountEmergenciesPerRange(f_id, f_every, f_start_date, f_end_date, @count);
	
                UPDATE `areas` SET `count` = @count WHERE `id` = f_id;
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
           
            select _count,inc,u_start_date;
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




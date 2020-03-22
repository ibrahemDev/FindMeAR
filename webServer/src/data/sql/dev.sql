











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





call generateEmergenciesData(120,21.41145131816501, 39.89428524793895,2000 ,'2020-03-01T00:00','2020-03-30T00:00');
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
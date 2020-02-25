# this file have 3 PROCEDURES and one event that will select all Emergencies using loop and get closest Paramedic for Emergencie and using event using PROCEDURE every 30 sec or what you need :)
#DONE :)
/*
javascript algorithm 
function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}



call measureLatLon(21.422168,39.817697,21.422615, 39.818319,@a);
select @a;
*/

drop PROCEDURE if exists measureLatLon;
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

# loop for all Paramedic
drop PROCEDURE if exists getBestParamedicForEmergencie;
DELIMITER //
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
	#DECLARE _legth double;
    
    
	
    
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
    
END//
DELIMITER ;

call GetAllParamedicsOnlineAndResponeParamedicToEmergencie();

# loop for all Emergencies
drop PROCEDURE if exists GetAllParamedicsOnlineAndResponeParamedicToEmergencie;
DELIMITER //
CREATE  PROCEDURE `GetAllParamedicsOnlineAndResponeParamedicToEmergencie`()
BEGIN
	DECLARE done INT DEFAULT FALSE;
	#DECLARE out_paramedic_id int;
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
    

END//
DELIMITER ;
























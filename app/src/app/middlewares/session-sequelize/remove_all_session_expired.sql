CREATE EVENT IF NOT EXISTS `remove_all_session_expired`
ON SCHEDULE EVERY 1 DAY STARTS now()
ON COMPLETION NOT PRESERVE ENABLE
DO DELETE FROM `sessions` WHERE `sessions`.`expires` < now();






ALTER TABLE `resenas`
  MODIFY `calificacion` TINYINT UNSIGNED NOT NULL,
  ADD CONSTRAINT `resenas_calificacion_check`
    CHECK (`calificacion` BETWEEN 1 AND 5);
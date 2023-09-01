SELECT
  "Meals".id,
  "Meals".name,
  "Meals".location,
  "Meals".servings
FROM
  "Meals"
WHERE
  (
    NOT (
      "Meals".id IN (
        SELECT
          "Plan".meal_id
        FROM
          "Plan"
      )
    )
  )
ORDER BY
  (random());
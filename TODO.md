# Idol Meals Complete Refactor Plan

**Status**: Embedded favoriteFoods added to Idol model ✓

**Remaining**:
- [ ] Update idolController getIdols (public + populate foods)
- [ ] New APIs: addFoodToIdol, removeFoodFromIdol, updateFoodInIdol
- [ ] Update AdminIdols.jsx for embedded array CRUD
- [ ] Update IdolMeals.jsx frontend (foods from idol.favoriteFoods)
- [ ] Remove FavoriteFood model + routes/controllers (migration)
- [ ] Update services/idolAPI.js

**Data migration**: Manual – delete FavoriteFood collection, re-add via new admin.

**Next**: Public getIdols API.


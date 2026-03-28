# Remove Rating from Admin Food Management

## Steps:
1. **[x]** Edit `backend/models/Product.js`: Remove `rating` and `numReviews` fields from schema.
2. **[x]** Edit `frontend/src/pages/admin/AdminFoods.jsx`: 
   - Remove `rating: 0,` from formData initial state and reset.
   - Remove the rating input field block.
   - Remove `<th>Rating</th>` from table header.
   - Remove `<td>{food.rating || 0}</td>` from table rows.
3. **[ ]** Restart backend server (`cd backend && npm start`).
4. **[ ]** Restart frontend dev server (`cd frontend && npm run dev`).
5. **[ ]** Test:
   - Login as admin → AdminFoods page: No rating input/form field/column.
   - Add new food: Succeeds without rating.
   - List shows no rating column.
6. **[x]** Complete task

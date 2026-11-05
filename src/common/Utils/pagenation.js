export const pagenation = async (
  ModelRepo,
  page = 1,
  limit = 5,
  filters = {},
) => {
  const skip = (page - 1) * limit;
  const allDocuments = await ModelRepo.countOfDocuments(filters);
  const numOfPages = Math.ceil(allDocuments / limit);

  const pagenate = {
    Count_Documents: allDocuments,
    Num_Pages: numOfPages,
    Current_Page: page,
    Limit_Page: limit,
  };

  return { pagenate, skip };
};

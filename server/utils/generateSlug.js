import slugify from 'slugify';

// "Teak Wood Carved Door" -> "teak-wood-carved-door"
const createSlug = (title) => {
    return slugify(title, {
        lower: true, // lowercase
        strict: true, // special characters remove
        trim: true,
    });
};

// baseSlug already DB la irukka nu check panni, irundha -1, -2 nu append pannurom
const generateUniqueSlug = async (title, Model, excludeId = null) => {
    const baseSlug = createSlug(title);
    let slug = baseSlug;
    let counter = 1;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const query = { slug };
        if (excludeId) {
            query._id = { $ne: excludeId }; // edit pannும்போது, ஒண்ணே தான் இருக்குனா skip pannanum
        }

        const existing = await Model.findOne(query);
        if (!existing) break;

        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
};

export { createSlug, generateUniqueSlug };
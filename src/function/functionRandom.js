export const Random = async (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}
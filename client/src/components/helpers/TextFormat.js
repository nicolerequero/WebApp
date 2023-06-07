export function capitalizeWords(name) {
    return name.replace(/\b(\w)/g, s => s.toUpperCase());
}
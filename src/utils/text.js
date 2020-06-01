module.exports = {
    clear: text => text
        .replace(/^\s*/, "")
        .replace(/\s*$/, "")
        .replace(/\n+/, " ")
}

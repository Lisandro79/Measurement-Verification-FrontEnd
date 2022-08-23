const MONTH_GAP = 1
const LAST_TWO_DIGITS = 2

export async function formatDate(data) {

    for (const [idx, row] of data.slice(1).entries()) {
        let parsedDate = await parseDate(row[0])
        data[idx + 1][0] = parsedDate
    }

    return data
}

const parseDate = async (date) => {
    date = new Date(date)
    let parsedDate = `${date.getMonth() + MONTH_GAP}/${date.getDate()}/${date.getFullYear().toString().slice(-LAST_TWO_DIGITS)} ${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`
    return parsedDate
}

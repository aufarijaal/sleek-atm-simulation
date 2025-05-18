declare module '@develoka/angka-rupiah-js' {
    export interface ToRupiahOptions {
        symbol?: string | null // Currency symbol, e.g., 'Rp', 'IDR', or null to omit
        formal?: boolean // Determines symbol position according to Indonesian language rules
        dot?: string // Symbol to replace the decimal point
        decimal?: string // Symbol to replace the comma
        floatingPoint?: number // Number of digits after the decimal point
        replaceZeroDecimals?: boolean // Replace zero decimals with ",-"
        useUnit?: boolean // Use units like 'rb', 'jt', 'M', 'T'
        k?: boolean // Replace 'rb' with 'k'
        longUnit?: boolean // Expand unit abbreviations to full words
        spaceBeforeUnit?: boolean // Add a space between the number and the unit
    }

    export default function toRupiah(
        value: number,
        options?: ToRupiahOptions
    ): string
}

const ones = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan']

function convertGroup(num: number): string {
  if (num === 0) return ''
  if (num < 10) return ones[num]
  if (num < 20) {
    if (num === 10) return 'sepuluh'
    if (num === 11) return 'sebelas'
    return ones[num - 10] + ' belas'
  }
  if (num < 100) {
    return ones[Math.floor(num / 10)] + ' puluh' + (num % 10 > 0 ? ' ' + ones[num % 10] : '')
  }
  if (num < 1000) {
    const hundreds = Math.floor(num / 100)
    const rest = num % 100
    let result = ''
    if (hundreds === 1) result = 'seratus'
    else result = ones[hundreds] + ' ratus'
    if (rest > 0) result += ' ' + convertGroup(rest)
    return result
  }
  return ''
}

export function terbilang(amount: number): string {
  if (amount === 0) return 'nol'

  const groups: string[] = []
  const scales = ['', 'ribu', 'juta', 'miliar', 'triliun']

  let num = Math.floor(amount)
  let scaleIndex = 0

  while (num > 0 && scaleIndex < scales.length) {
    const group = num % 1000
    if (group > 0) {
      let groupText = convertGroup(group)
      if (scaleIndex === 1 && group === 1) {
        groupText = 'seribu'
        groups.unshift(groupText)
      } else {
        groups.unshift(groupText + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : ''))
      }
    }
    num = Math.floor(num / 1000)
    scaleIndex++
  }

  let result = groups.join(' ').trim()
  result = result.charAt(0).toUpperCase() + result.slice(1)
  return result + ' rupiah'
}

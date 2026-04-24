import ExcelJS from "exceljs"
import type { BookingWithDetails } from "@/types"

/* ─── Colour palette ─────────────────────────────── */
const C = {
  headerBg: "2B1B52",
  headerText: "EDE9FE",
  accent: "6D28D9",
  rowAlt: "F5F0FF",
  muted: "A78BFA",
  // Status fills
  pending: { bg: "FEF3C7", fg: "92400E" },
  approved: { bg: "D1FAE5", fg: "065F46" },
  rejected: { bg: "FEE2E2", fg: "991B1B" },
} as const

/* ─── Helpers ─────────────────────────────────────── */
function headerStyle(ws: ExcelJS.Worksheet, row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + C.headerBg } }
    cell.font = { bold: true, size: 11, color: { argb: "FF" + C.headerText }, name: "Calibri" }
    cell.alignment = { vertical: "middle", horizontal: "center" }
    cell.border = {
      top: { style: "thin", color: { argb: "FF" + C.accent } },
      left: { style: "thin", color: { argb: "FF" + C.accent } },
      bottom: { style: "thin", color: { argb: "FF" + C.accent } },
      right: { style: "thin", color: { argb: "FF" + C.accent } },
    }
  })
  row.height = 28
  void ws
}

function applyDataBorder(cell: ExcelJS.Cell) {
  cell.border = {
    top: { style: "hair", color: { argb: "336D28D9" } },
    left: { style: "hair", color: { argb: "336D28D9" } },
    bottom: { style: "hair", color: { argb: "336D28D9" } },
    right: { style: "hair", color: { argb: "336D28D9" } },
  }
}

function fmtDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString("en-MY", { day: "2-digit", month: "2-digit", year: "numeric" })
}

function fmtMonth(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return "Unknown"
  return d.toLocaleDateString("en-MY", { month: "long", year: "numeric" })
}

/* ─── Sheet 1: Bookings ──────────────────────────── */
async function buildBookingsSheet(
  wb: ExcelJS.Workbook,
  bookings: BookingWithDetails[],
  logoBase64: string | null,
) {
  const ws = wb.addWorksheet("Bookings", {
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
    headerFooter: {
      oddHeader: "&LLaman Troka — Booking Report",
      oddFooter: "&C&P of &N",
    },
  })

  /* ── Column widths ── */
  ws.columns = [
    { key: "ref",         width: 14 },
    { key: "bride",       width: 16 },
    { key: "groom",       width: 16 },
    { key: "email",       width: 26 },
    { key: "phone",       width: 14 },
    { key: "event_date",  width: 13 },
    { key: "time_slot",   width: 12 },
    { key: "package",     width: 20 },
    { key: "guests",      width:  8 },
    { key: "total",       width: 13 },
    { key: "deposit",     width: 14 },
    { key: "status",      width: 12 },
    { key: "created_at",  width: 14 },
  ]

  /* ── Rows 1-3: Branding header ── */
  ws.mergeCells("D1:M1")
  ws.mergeCells("D2:M2")
  ws.mergeCells("D3:M3")
  ws.mergeCells("A1:C3")

  const totalRevenue = bookings.reduce((s, b) => s + (b.total_rm ?? 0), 0)
  const totalDeposit = bookings.reduce((s, b) => s + (b.deposit_rm ?? 0), 0)

  const titleCell = ws.getCell("D1")
  titleCell.value = "LAMAN TROKA — Booking Report"
  titleCell.font = { bold: true, size: 18, color: { argb: "FF" + C.headerText }, name: "Cambria" }
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + C.headerBg } }
  titleCell.alignment = { vertical: "middle", horizontal: "center" }

  const exportedCell = ws.getCell("D2")
  exportedCell.value = `Exported: ${new Date().toLocaleDateString("en-MY", { day: "2-digit", month: "long", year: "numeric" })}`
  exportedCell.font = { italic: true, size: 10, color: { argb: "FF" + C.muted }, name: "Calibri" }
  exportedCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + C.headerBg } }
  exportedCell.alignment = { vertical: "middle", horizontal: "center" }

  const summaryCell = ws.getCell("D3")
  summaryCell.value = `Total Bookings: ${bookings.length}   |   Total Revenue: RM ${totalRevenue.toLocaleString("en-MY", { minimumFractionDigits: 2 })}   |   Total Deposits: RM ${totalDeposit.toLocaleString("en-MY", { minimumFractionDigits: 2 })}`
  summaryCell.font = { size: 10, color: { argb: "FF" + C.headerText }, name: "Calibri" }
  summaryCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + C.headerBg } }
  summaryCell.alignment = { vertical: "middle", horizontal: "center" }

  ws.getRow(1).height = 36
  ws.getRow(2).height = 20
  ws.getRow(3).height = 20

  /* ── Logo image ── */
  if (logoBase64) {
    const imgId = wb.addImage({ base64: logoBase64, extension: "png" })
    ws.addImage(imgId, {
      tl: { col: 0, row: 0 } as ExcelJS.Anchor,
      ext: { width: 180, height: 72 },
    })
  } else {
    const logoCell = ws.getCell("A1")
    logoCell.value = "LAMAN TROKA"
    logoCell.font = { bold: true, size: 16, color: { argb: "FF" + C.accent }, name: "Cambria" }
    logoCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + C.headerBg } }
    logoCell.alignment = { vertical: "middle", horizontal: "center" }
  }

  /* ── Row 4: spacer ── */
  ws.getRow(4).height = 6

  /* ── Row 5: Column headers ── */
  const HEADERS = ["Ref", "Bride", "Groom", "Email", "Phone", "Event Date", "Time Slot", "Package", "Guests", "Total (RM)", "Deposit (RM)", "Status", "Created At"]
  const headerRow = ws.getRow(5)
  headerRow.values = HEADERS
  headerStyle(ws, headerRow)

  /* ── Freeze panes + auto-filter ── */
  ws.views = [{ state: "frozen", ySplit: 5 }]
  ws.autoFilter = { from: "A5", to: "M5" }

  /* ── Print row repeat ── */
  ws.pageSetup.printTitlesRow = "5:5"

  /* ── Data rows ── */
  bookings.forEach((b, idx) => {
    const rowNum = 6 + idx
    const isAlt = idx % 2 === 0
    const bgArgb = "FF" + (isAlt ? C.rowAlt : "FFFFFF")

    const row = ws.getRow(rowNum)
    row.values = [
      b.ref,
      b.bride_name,
      b.groom_name,
      b.email,
      b.phone,
      fmtDate(b.event_date),
      b.time_slot,
      b.package?.name ?? "",
      b.guest_count,
      b.total_rm ?? 0,
      b.deposit_rm ?? 0,
      b.status,
      new Date(b.created_at).toLocaleDateString("en-MY"),
    ]
    row.height = 22

    row.eachCell({ includeEmpty: true }, (cell, colNum) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgArgb } }
      cell.font = { size: 10, name: "Calibri", color: { argb: "FF333333" } }
      cell.alignment = { vertical: "middle" }
      applyDataBorder(cell)

      // Ref column — bold purple
      if (colNum === 1) {
        cell.font = { bold: true, size: 10, name: "Calibri", color: { argb: "FF" + C.accent } }
      }

      // RM columns
      if (colNum === 10 || colNum === 11) {
        cell.numFmt = '"RM "#,##0.00'
        cell.alignment = { vertical: "middle", horizontal: "right" }
      }

      // Status column — colour coded
      if (colNum === 12) {
        const status = b.status as keyof typeof C
        const sc = C[status as "pending" | "approved" | "rejected"]
        if (sc) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + sc.bg } }
          cell.font = { bold: true, size: 10, name: "Calibri", color: { argb: "FF" + sc.fg } }
          cell.alignment = { vertical: "middle", horizontal: "center" }
        }
      }
    })
  })
}

/* ─── Sheet 2: Summary ───────────────────────────── */
function buildSummarySheet(wb: ExcelJS.Workbook, bookings: BookingWithDetails[]) {
  const ws = wb.addWorksheet("Summary")
  ws.columns = [
    { width: 20 }, { width: 12 }, { width: 18 }, { width: 14 },
  ]

  /* ── Title ── */
  ws.mergeCells("A1:D1")
  const title = ws.getCell("A1")
  title.value = "BOOKING SUMMARY"
  title.font = { bold: true, size: 16, name: "Cambria", color: { argb: "FF" + C.headerText } }
  title.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + C.headerBg } }
  title.alignment = { vertical: "middle", horizontal: "center" }
  ws.getRow(1).height = 36

  /* ── Status breakdown ── */
  ws.getRow(2).height = 8

  const statusHeaderRow = ws.getRow(3)
  statusHeaderRow.values = ["Status", "Count", "Revenue (RM)", "% of Total"]
  headerStyle(ws, statusHeaderRow)

  const totalRevenue = bookings.reduce((s, b) => s + (b.total_rm ?? 0), 0)
  const statuses: Array<"pending" | "approved" | "rejected"> = ["pending", "approved", "rejected"]

  statuses.forEach((status, idx) => {
    const filtered = bookings.filter((b) => b.status === status)
    const revenue = filtered.reduce((s, b) => s + (b.total_rm ?? 0), 0)
    const pct = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0
    const row = ws.getRow(4 + idx)
    row.values = [status.charAt(0).toUpperCase() + status.slice(1), filtered.length, revenue, pct / 100]
    row.height = 22

    const sc = C[status]
    row.eachCell({ includeEmpty: true }, (cell, colNum) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + sc.bg } }
      cell.font = { size: 10, name: "Calibri", color: { argb: "FF" + sc.fg } }
      cell.alignment = { vertical: "middle" }
      applyDataBorder(cell)
      if (colNum === 1) cell.font = { bold: true, size: 10, name: "Calibri", color: { argb: "FF" + sc.fg } }
      if (colNum === 3) cell.numFmt = '"RM "#,##0.00'
      if (colNum === 4) cell.numFmt = "0.0%"
    })
  })

  /* ── Monthly breakdown ── */
  const spacerRow = 4 + statuses.length + 1
  ws.getRow(spacerRow).height = 8

  const monthHeaderRow = ws.getRow(spacerRow + 1)
  monthHeaderRow.values = ["Month", "Bookings", "Revenue (RM)"]
  headerStyle(ws, monthHeaderRow)

  // Group by month from event_date
  const monthMap = new Map<string, { count: number; revenue: number; sortKey: string }>()
  bookings.forEach((b) => {
    const month = fmtMonth(b.event_date)
    const sortKey = b.event_date.slice(0, 7) // YYYY-MM
    const existing = monthMap.get(month) ?? { count: 0, revenue: 0, sortKey }
    existing.count++
    existing.revenue += b.total_rm ?? 0
    monthMap.set(month, existing)
  })

  const months = Array.from(monthMap.entries()).sort((a, b) =>
    a[1].sortKey.localeCompare(b[1].sortKey)
  )

  months.forEach(([month, data], idx) => {
    const row = ws.getRow(spacerRow + 2 + idx)
    row.values = [month, data.count, data.revenue]
    row.height = 22
    const isAlt = idx % 2 === 0

    row.eachCell({ includeEmpty: true }, (cell, colNum) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + (isAlt ? C.rowAlt : "FFFFFF") } }
      cell.font = { size: 10, name: "Calibri", color: { argb: "FF333333" } }
      cell.alignment = { vertical: "middle" }
      applyDataBorder(cell)
      if (colNum === 3) cell.numFmt = '"RM "#,##0.00'
    })
  })
}

/* ─── Main export function ───────────────────────── */
export async function exportExcel(bookings: BookingWithDetails[]): Promise<void> {
  // Fetch logo as base64
  let logoBase64: string | null = null
  try {
    const res = await fetch("/laman-troke-logo.png")
    if (res.ok) {
      const buf = await res.arrayBuffer()
      logoBase64 = btoa(Array.from(new Uint8Array(buf), (b) => String.fromCharCode(b)).join(""))
    }
  } catch {
    // logo fetch failed — proceed without logo
  }

  const wb = new ExcelJS.Workbook()
  wb.creator = "Laman Troka"
  wb.lastModifiedBy = "Laman Troka Admin"
  wb.created = new Date()
  wb.modified = new Date()

  await buildBookingsSheet(wb, bookings, logoBase64)
  buildSummarySheet(wb, bookings)

  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `lamantroka-bookings-${new Date().toISOString().split("T")[0]}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}

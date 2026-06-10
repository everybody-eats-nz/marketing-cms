import { redirect } from 'next/navigation'

// The QR codes printed on tables point at the old Webflow URL
// /dine-with-us/pay/all — keep it working forever.
export default function LegacyPayAllRedirect() {
  redirect('/dine-with-us/pay')
}

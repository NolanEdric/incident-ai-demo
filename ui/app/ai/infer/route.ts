import { useSearchParams } from "next/navigation"

export default function POST() {
  const searchParams = useSearchParams()
 
  const search = searchParams.get('search')
}

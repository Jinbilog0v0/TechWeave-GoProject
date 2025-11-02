import Sidebar from "../Components/Sidebar"
import HomeCalendar from "../Components/HomeCalendar"

export default function Home() {
  return <div>

  <div className="fixed left-0 top-0 h-full">
    <Sidebar />
  </div>

  <main className="ml-[200px] p-6 min-h-screen">
    <div>
      <HomeCalendar />
    </div>

    <div>
      {/* Expense Tracker */}
    </div>

    <div>
      {/* Status */}
    </div>
  </main>

  </div>
}
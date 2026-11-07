import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="inline-block p-4 border-2 border-black bg-black text-white font-mono text-3xl font-bold tracking-widest">
        404
      </div>
      <h1 className="text-h1">Listing or Page Not Found</h1>
      <p className="text-sm text-black/75 max-w-md mx-auto leading-relaxed">
        The hardware listing or page you are looking for has been relocated or is currently out of catalogue circulation.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white text-xs font-mono uppercase rounded-sm hover:bg-black/85"
        >
          <Home className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-5 py-3 border border-black text-xs font-mono uppercase rounded-sm hover:bg-black hover:text-white"
        >
          <Search className="w-4 h-4" />
          <span>Browse Catalogue</span>
        </Link>
      </div>
    </div>
  );
}

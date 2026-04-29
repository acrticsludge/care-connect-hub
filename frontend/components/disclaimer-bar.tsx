import Link from "next/link";

export function DisclaimerBar() {
  return (
    <footer className="bg-[#FFFEF5] border-t border-[#FDE68A] px-8 py-5 text-center">
      <p className="text-[12px] text-[#A39A5C] leading-relaxed max-w-[640px] mx-auto">
        <strong className="font-semibold text-[#57522A]">Medical disclaimer:</strong> This tool is
        not a substitute for professional medical advice, diagnosis, or treatment. Always seek
        the advice of your physician with any questions about a medical condition.
      </p>
      <div className="flex justify-center gap-5 mt-3">
        {["Privacy policy", "Terms of use", "About"].map((label) => (
          <Link
            key={label}
            href="/"
            className="text-[12px] text-[#A39A5C] hover:text-[#D4A810] transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
      <div className="mt-3 text-[11px] text-[#D4C98A]">
        &copy; 2026 CareConnectHub AI — All rights reserved
      </div>
    </footer>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Home() {
  const [stage, setStage] = useState("hero"); // hero | form | error | secret
  const [food, setFood] = useState("");
  const [color, setColor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [showKidding, setShowKidding] = useState(false);

  const handleSubmit = async () => {
    if (!food.trim() || !color.trim()) return;
    setSubmitting(true);
    try {
      await base44.entities.Answer.create({ food: food.trim(), color: color.trim() });
    } catch (e) {
      // ignore save errors for the prank flow
    }
    setSubmitting(false);

    // Secret trick
    if (food.trim() === "ヤモリ" && color.trim() === "虹色") {
      setLoadingAnswers(true);
      setStage("secret");
      try {
        const page = await base44.entities.Answer.filter({}, { sort: "-created_date", limit: 500 });
        setAnswers(page.items || []);
      } catch (e) {
        setAnswers([]);
      }
      setLoadingAnswers(false);
      return;
    }

    // Prank error
    setStage("error");
    setShowKidding(false);
    setTimeout(() => setShowKidding(true), 1800);
  };

  const resetAll = () => {
    setStage("hero");
    setFood("");
    setColor("");
    setShowKidding(false);
  };

  return (
    <div className="min-h-screen w-full" style={{ background: "#F9F7F2", color: "#1A1A1B" }}>
      {/* Hero */}
      {stage === "hero" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative min-h-screen flex flex-col px-6 sm:px-12 py-8"
        >
          {/* Top bar */}
          <div className="flex items-start justify-between w-full">
            <div className="text-xs tracking-[0.3em] uppercase opacity-60">YUINA'S ARCHIVE</div>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setStage("form")}>
              <span
                className="font-bold leading-none select-none transition-transform group-hover:scale-105"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontFamily: "'Shippori Mincho', serif" }}
              >
                見るにはこちら→
              </span>
              <motion.span
                whileHover={{ scale: 1.2, rotate: -8 }}
                className="select-none"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                🐈‍⬛
              </motion.span>
            </div>
          </div>

          {/* Title */}
          <div className="flex-1 flex items-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-bold leading-[1.1]"
              style={{
                fontSize: "clamp(3.5rem, 12vw, 9rem)",
                fontFamily: "'Shippori Mincho', serif",
                letterSpacing: "0.02em",
              }}
            >
              ゆいなの<br />日常
            </motion.h1>
          </div>

          <div className="text-sm opacity-50 tracking-wider">— ちょっとした日々の記録 —</div>
        </motion.div>
      )}

      {/* Questionnaire */}
      <AnimatePresence>
        {stage === "form" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-xl"
            >
              <div className="text-sm opacity-70 mb-8 text-center select-none" style={{ fontFamily: "'Shippori Mincho', serif" }}>Googleアカウントでログイン</div>
              <div className="space-y-10">
                <div>
                  <label className="block mb-3 text-lg" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                    メールアドレス
                  </label>
                  <Input
                    value={food}
                    onChange={(e) => setFood(e.target.value)}
                    className="bg-transparent border-0 border-b-2 rounded-none px-0 py-3 text-lg focus-visible:ring-0"
                    style={{ borderColor: "#1A1A1B", fontFamily: "'Shippori Mincho', serif" }}
                  />
                </div>
                <div>
                  <label className="block mb-3 text-lg" style={{ fontFamily: "'Shippori Mincho', serif" }}>
                    パスワード
                  </label>
                  <Input
                    type="password"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="bg-transparent border-0 border-b-2 rounded-none px-0 py-3 text-lg focus-visible:ring-0"
                    style={{ borderColor: "#1A1A1B", fontFamily: "'Shippori Mincho', serif" }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-12">
                <button
                  onClick={() => setStage("hero")}
                  className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                >
                  ← 戻る
                </button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !food.trim() || !color.trim()}
                  className="px-10 py-6 text-lg rounded-full"
                  style={{ background: "#1A1A1B", color: "#F9F7F2" }}
                >
                  {submitting ? "送信中..." : "次へ →"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error prank */}
      <AnimatePresence>
        {stage === "error" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6"
            style={{ background: "#FF4D00", color: "#fff" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-center"
            >
              <div
                className="font-mono font-bold leading-tight"
                style={{ fontSize: "clamp(2rem, 7vw, 5rem)" }}
              >
                SYSTEM ERROR 404
              </div>
              <div className="font-mono mt-4 opacity-90" style={{ fontSize: "clamp(1rem, 2.5vw, 1.75rem)" }}>
                EMOTION NOT FOUND
              </div>
            </motion.div>

            <AnimatePresence>
              {showKidding && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-16 text-center"
                >
                  <p
                    className="italic"
                    style={{ fontFamily: "'Shippori Mincho', serif", fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)" }}
                  >
                    なーんてね。冗談だよ 😸
                  </p>
                  <button
                    onClick={resetAll}
                    className="mt-6 underline underline-offset-4 opacity-90 hover:opacity-100"
                  >
                    最初に戻る
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secret archive */}
      <AnimatePresence>
        {stage === "secret" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col px-6 sm:px-12 py-8"
            style={{ background: "#4A90E2", color: "#fff" }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="text-xs tracking-[0.3em] uppercase opacity-80">SECRET ARCHIVE</div>
              <button onClick={resetAll} className="text-sm underline underline-offset-4 opacity-90 hover:opacity-100">
                ← 戻る
              </button>
            </div>

            <h2
              className="mb-2"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontFamily: "'Shippori Mincho', serif" }}
            >
              みんなの回答
            </h2>
            <p className="opacity-80 mb-8 text-sm">裏技発動！これまでの全回答だよ 🌈</p>

            {loadingAnswers ? (
              <div className="py-20 text-center opacity-80">読み込み中...</div>
            ) : answers.length === 0 ? (
              <div className="py-20 text-center opacity-80">まだ回答がありません</div>
            ) : (
              <div className="rounded-lg overflow-hidden border border-white/40 bg-white/10 backdrop-blur-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/40 hover:bg-white/10">
                      <TableHead className="text-white font-bold">好きな食べ物</TableHead>
                      <TableHead className="text-white font-bold">好きな色</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {answers.map((a, i) => (
                      <TableRow key={a.id || i} className="border-white/20 hover:bg-white/10">
                        <TableCell className="text-white">{a.food}</TableCell>
                        <TableCell className="text-white">{a.color}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <div className="mt-6 text-sm opacity-70">全 {answers.length} 件の回答</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

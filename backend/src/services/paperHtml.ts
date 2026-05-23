import { IGeneratedPaper } from '../models/GeneratedPaper'

const difficultyStyles: Record<string, string> = {
  easy: 'background:#dcfce7;color:#166534',
  moderate: 'background:#fef9c3;color:#854d0e',
  hard: 'background:#fee2e2;color:#991b1b',
}

export function buildPaperHtml(paper: IGeneratedPaper): string {
  const hasAnswers = paper.sections.some((s) => s.questions.some((q) => q.answer))

  const sectionsHtml = paper.sections
    .map((section) => {
      const questionsHtml = section.questions
        .map((q, idx) => {
          const badge = `<span style="display:inline-block;padding:1px 8px;border-radius:999px;font-size:11px;font-weight:600;${difficultyStyles[q.difficulty] ?? ''}">${q.difficulty}</span>`
          return `
          <li style="margin-bottom:10px;line-height:1.6">
            <span style="font-size:13px">${q.text}</span>
            <span style="margin-left:8px">${badge}</span>
            <span style="float:right;font-size:12px;color:#555">[${q.marks} Marks]</span>
          </li>`
        })
        .join('')

      return `
      <div style="margin-bottom:24px">
        <h3 style="text-align:center;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">${section.title}</h3>
        <p style="font-weight:600;font-size:13px;margin:4px 0">${section.questionType}</p>
        <p style="font-style:italic;font-size:12px;color:#444;margin:4px 0 10px">${section.instruction}</p>
        <ol style="padding-left:20px;margin:0">${questionsHtml}</ol>
      </div>`
    })
    .join('')

  const answerKeyHtml = hasAnswers
    ? `
    <div style="margin-top:32px;border-top:1px solid #ccc;padding-top:16px;page-break-before:always">
      <p style="font-weight:700;font-size:13px;margin-bottom:8px">Answer Key:</p>
      <ol style="padding-left:20px;font-size:12px;color:#333;line-height:1.8">
        ${paper.sections
          .flatMap((s) => s.questions.filter((q) => q.answer).map((q) => `<li>${q.answer}</li>`))
          .join('')}
      </ol>
    </div>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, 'Times New Roman', serif; font-size: 13px; color: #111; background: white; }
    .blank { display: inline-block; border-bottom: 1.5px solid #666; width: 120px; margin: 0 4px; }
  </style>
</head>
<body>
  <!-- Header -->
  <div style="text-align:center;margin-bottom:16px">
    <h1 style="font-size:17px;font-weight:700">${paper.schoolName}, Sector-4, Bokaro</h1>
    <p style="font-size:14px;font-weight:600;margin-top:4px">Subject: ${paper.subject}</p>
    <p style="font-size:13px;margin-top:2px">Class: ${paper.gradeLevel}</p>
  </div>

  <!-- Meta row -->
  <div style="display:flex;justify-content:space-between;border-top:1px solid #999;border-bottom:1px solid #999;padding:6px 0;margin-bottom:12px;font-weight:600;font-size:13px">
    <span>Time Allowed: ${paper.timeAllowed}</span>
    <span>Maximum Marks: ${paper.totalMarks}</span>
  </div>

  <!-- Instructions -->
  <p style="font-size:12px;color:#333;margin-bottom:12px">All questions are compulsory unless stated otherwise.</p>

  <!-- Student info -->
  <div style="font-size:13px;margin-bottom:20px;line-height:2">
    <div>Name: <span class="blank"></span></div>
    <div>Roll Number: <span class="blank" style="width:100px"></span></div>
    <div>Class: ${paper.gradeLevel} &nbsp; Section: <span class="blank" style="width:80px"></span></div>
  </div>

  <!-- Sections -->
  ${sectionsHtml}

  <!-- End of paper -->
  <div style="text-align:center;font-weight:700;font-size:13px;margin-top:24px;padding-top:12px;border-top:1px solid #ccc">
    End of Question Paper
  </div>

  ${answerKeyHtml}
</body>
</html>`
}

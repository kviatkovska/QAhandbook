const form = document.getElementById('sandbox-form');
const levelSelect = document.getElementById('level');
const sectionSelect = document.getElementById('section');
const languageSelect = document.getElementById('language');
const toolSelect = document.getElementById('tool');
const experienceSelect = document.getElementById('experience');
const generateBtn = document.getElementById('generate-question');
const questionBlock = document.getElementById('question-block');
const generatedQuestion = document.getElementById('generated-question');
const answerTextarea = document.getElementById('answer');
const emptyState = document.getElementById('empty-state');
const currentYear = document.getElementById('current-year');

let allQuestions = [];

// Set current year in footer
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Load questions from JSON file
async function loadQuestions() {
    try {
        const res = await fetch('questions.json');
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        allQuestions = data.questions || [];
    } catch (error) {
        console.error('Не вдалося завантажити questions.json:', error);
        emptyState.hidden = false;
        emptyState.textContent = '❌ Не вдалося завантажити питання. Перевірте файл questions.json.';
    }
}

// Check if question matches selected filters
function matchesFilter(question, selectedLevel, selectedSection, selectedLanguage, selectedTool, selectedExperience) {
    const levelMatch = question.level === selectedLevel || question.level === 'All';
    const sectionMatch = question.section === selectedSection || question.section === 'All';
    const languageMatch = question.language === selectedLanguage || question.language === 'All';
    const toolMatch = question.tool === selectedTool || question.tool === 'All';
    const experienceMatch = question.experience === selectedExperience || question.experience === 'All';

    return levelMatch && sectionMatch && languageMatch && toolMatch && experienceMatch;
}

// Get random question from filtered array
function getRandomQuestion(filtered) {
    if (!filtered || filtered.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
}

// Generate and display question
function generateQuestion() {
    const selectedLevel = levelSelect.value;
    const selectedSection = sectionSelect.value;
    const selectedLanguage = languageSelect.value;
    const selectedTool = toolSelect.value;
    const selectedExperience = experienceSelect.value;

    const filteredQuestions = allQuestions.filter((question) =>
        matchesFilter(question, selectedLevel, selectedSection, selectedLanguage, selectedTool, selectedExperience)
    );

    const selectedQuestion = getRandomQuestion(filteredQuestions);

    if (!selectedQuestion) {
        questionBlock.hidden = true;
        emptyState.hidden = false;
        return;
    }

    emptyState.hidden = true;
    questionBlock.hidden = false;
    generatedQuestion.textContent = selectedQuestion.text;
    answerTextarea.value = ''; // Clear previous answer
}

// Event listeners
generateBtn.addEventListener('click', generateQuestion);

// Load questions on page load
loadQuestions();

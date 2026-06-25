// Course definitions
const courses = {
  mcp: {
    name: 'MCP',
    color: 'mcp',
    basePath: 'mcp',
    chapters: [
      { id: '01', title: 'MCP란 무엇인가', file: '01-what-is-mcp.html', level: 'basic' },
      { id: '02', title: '환경 설정', file: '02-environment-setup.html', level: 'basic' },
      { id: '03', title: '첫 번째 MCP 서버', file: '03-first-server.html', level: 'basic' },
      { id: '04', title: 'Tools 심화', file: '04-tools.html', level: 'basic' },
      { id: '05', title: 'Resources 심화', file: '05-resources.html', level: 'basic' },
      { id: '06', title: 'Prompts 심화', file: '06-prompts.html', level: 'basic' },
      { id: '07', title: 'Transport', file: '07-transport.html', level: 'basic' },
      { id: '08', title: 'MCP 클라이언트', file: '08-client.html', level: 'basic' },
      { id: '09', title: 'Structured Output', file: '09-structured-output.html', level: 'advanced' },
      { id: '10', title: '서버 컴포지션', file: '10-server-composition.html', level: 'advanced' },
      { id: '11', title: 'OAuth 인증', file: '11-auth.html', level: 'advanced' },
      { id: '12', title: 'Context 및 Logging', file: '12-context-logging.html', level: 'advanced' },
      { id: '13', title: 'Starlette/ASGI 통합', file: '13-asgi-integration.html', level: 'advanced' },
    ]
  },
  langgraph: {
    name: 'LangGraph',
    color: 'langgraph',
    basePath: 'langgraph',
    chapters: [
      { id: '01', title: 'LangGraph란 무엇인가', file: '01-what-is-langgraph.html', level: 'basic' },
      { id: '02', title: '환경 설정', file: '02-environment-setup.html', level: 'basic' },
      { id: '03', title: '첫 번째 그래프', file: '03-first-graph.html', level: 'basic' },
      { id: '04', title: 'State 관리', file: '04-state.html', level: 'basic' },
      { id: '05', title: '조건부 라우팅', file: '05-conditional-routing.html', level: 'basic' },
      { id: '06', title: 'Tool 통합', file: '06-tools.html', level: 'basic' },
      { id: '07', title: 'ReAct 에이전트', file: '07-react-agent.html', level: 'basic' },
      { id: '08', title: 'Human-in-the-Loop', file: '08-human-in-the-loop.html', level: 'advanced' },
      { id: '09', title: '메모리와 체크포인팅', file: '09-memory-checkpointing.html', level: 'advanced' },
      { id: '10', title: '스트리밍', file: '10-streaming.html', level: 'advanced' },
      { id: '11', title: '멀티 에이전트', file: '11-multi-agent.html', level: 'advanced' },
      { id: '12', title: 'MCP 연동', file: '12-mcp-integration.html', level: 'advanced' },
    ]
  },
  rag: {
    name: 'RAG',
    color: 'rag',
    basePath: 'rag',
    chapters: [
      { id: '01', title: 'RAG란 무엇인가', file: '01-what-is-rag.html', level: 'basic' },
      { id: '02', title: '환경 설정', file: '02-environment-setup.html', level: 'basic' },
      { id: '03', title: '문서 로딩과 전처리', file: '03-document-loading.html', level: 'basic' },
      { id: '04', title: '청킹 전략', file: '04-chunking.html', level: 'basic' },
      { id: '05', title: '임베딩 모델', file: '05-embedding.html', level: 'basic' },
      { id: '06', title: '벡터 스토어', file: '06-vector-store.html', level: 'basic' },
      { id: '07', title: '검색과 생성', file: '07-retrieval-generation.html', level: 'basic' },
      { id: '08', title: '첫 번째 RAG 파이프라인', file: '08-first-rag-pipeline.html', level: 'basic' },
      { id: '09', title: '검색 품질 최적화', file: '09-search-optimization.html', level: 'advanced' },
      { id: '10', title: '고급 RAG 패턴', file: '10-advanced-rag-patterns.html', level: 'advanced' },
      { id: '11', title: 'RAG 평가', file: '11-rag-evaluation.html', level: 'advanced' },
      { id: '12', title: 'Kubernetes 배포', file: '12-kubernetes-deployment.html', level: 'advanced' },
      { id: '13', title: '프로덕션 운영', file: '13-production-operations.html', level: 'advanced' },
    ]
  }
};

// Detect current course and chapter
function detectCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop();
  const pathParts = path.split('/');

  for (const [courseId, course] of Object.entries(courses)) {
    // Check if path contains the course basePath
    if (pathParts.includes(course.basePath)) {
      const idx = course.chapters.findIndex(ch => ch.file === filename);
      if (idx !== -1) {
        return { courseId, chapterIndex: idx };
      }
    }
  }

  return { courseId: null, chapterIndex: -1 };
}

// Determine path prefix based on current location
function getPathPrefix(targetCourse) {
  const path = window.location.pathname;
  const pathParts = path.split('/');

  // On home page (index.html or root)
  const filename = pathParts[pathParts.length - 1];
  if (filename === 'index.html' || filename === '' || !filename.endsWith('.html')) {
    return targetCourse.basePath + '/';
  }

  // Inside a chapter directory
  const currentDir = pathParts[pathParts.length - 2];
  if (currentDir === targetCourse.basePath) {
    return '';
  }
  return '../' + targetCourse.basePath + '/';
}

// Build sidebar
function buildSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const { courseId: currentCourse } = detectCurrentPage();
  const activeCourse = currentCourse || 'mcp';

  let html = '';

  // Course tabs
  const homePath = detectCurrentPage().courseId ? '../index.html' : 'index.html';
  html += '<div class="sidebar__course-tabs">';
  for (const [cid, course] of Object.entries(courses)) {
    const isActive = cid === activeCourse;
    const activeClass = isActive ? ` sidebar__course-tab--active-${course.color}` : '';
    const prefix = getPathPrefix(course);
    const href = isActive ? '#' : prefix + course.chapters[0].file;
    html += `<a href="${href}" class="sidebar__course-tab${activeClass}" data-course="${cid}">${course.name}</a>`;
  }
  html += '</div>';

  // Show chapters for active course
  const course = courses[activeCourse];
  const { chapterIndex: currentIdx } = detectCurrentPage();
  const prefix = currentCourse ? '' : course.basePath + '/';
  const isMCP = activeCourse === 'mcp';
  const linkClass = isMCP ? '' : ` sidebar__link--${course.color}`;

  // Basic section
  html += `<div class="sidebar__section-title">기본 과정</div>`;
  course.chapters.filter(ch => ch.level === 'basic').forEach(ch => {
    const idx = course.chapters.indexOf(ch);
    let active = '';
    if (idx === currentIdx && currentCourse === activeCourse) {
      active = isMCP ? ' sidebar__link--active' : ` sidebar__link--active-${course.color}`;
    }
    html += `<a href="${prefix}${ch.file}" class="sidebar__link${linkClass}${active}">${ch.id}. ${ch.title}</a>`;
  });

  html += '<hr class="sidebar__divider">';

  // Advanced section
  const advClass = isMCP ? ' sidebar__section-title--advanced' : ` sidebar__section-title--${course.color}-advanced`;
  html += `<div class="sidebar__section-title${advClass}">심화 과정</div>`;
  course.chapters.filter(ch => ch.level === 'advanced').forEach(ch => {
    const idx = course.chapters.indexOf(ch);
    let active = '';
    if (idx === currentIdx && currentCourse === activeCourse) {
      active = isMCP ? ' sidebar__link--active' : ` sidebar__link--active-${course.color}`;
    }
    html += `<a href="${prefix}${ch.file}" class="sidebar__link${linkClass}${active}">${ch.id}. ${ch.title}</a>`;
  });

  sidebar.innerHTML = html;

  // Tab click handlers for switching courses on home page
  sidebar.querySelectorAll('.sidebar__course-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const cid = tab.dataset.course;
      if (cid === activeCourse) {
        e.preventDefault();
        return;
      }
    });
  });
}

// Build page navigation (prev/next)
function buildPageNav() {
  const nav = document.querySelector('.page-nav');
  if (!nav) return;

  const { courseId, chapterIndex: currentIdx } = detectCurrentPage();
  if (!courseId || currentIdx === -1) return;

  const course = courses[courseId];
  const chapters = course.chapters;
  const isMCP = courseId === 'mcp';
  const navClass = isMCP ? '' : ` page-nav__link--${course.color}`;

  let html = '';

  if (currentIdx > 0) {
    const prev = chapters[currentIdx - 1];
    html += `<a href="${prev.file}" class="page-nav__link page-nav__link--prev${navClass}">
      <span class="page-nav__label">← 이전</span>
      <span class="page-nav__title">${prev.id}. ${prev.title}</span>
    </a>`;
  }

  if (currentIdx < chapters.length - 1) {
    const next = chapters[currentIdx + 1];
    html += `<a href="${next.file}" class="page-nav__link page-nav__link--next${navClass}">
      <span class="page-nav__label">다음 →</span>
      <span class="page-nav__title">${next.id}. ${next.title}</span>
    </a>`;
  }

  nav.innerHTML = html;
}

// Copy button for code blocks
function setupCopyButtons() {
  document.querySelectorAll('.code-block').forEach(block => {
    const btn = block.querySelector('.code-block__copy');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const code = block.querySelector('code');
      if (!code) return;

      navigator.clipboard.writeText(code.textContent).then(() => {
        btn.textContent = '복사됨!';
        setTimeout(() => { btn.textContent = '복사'; }, 1500);
      });
    });
  });
}

// Hamburger toggle for mobile
function setupHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');
  if (!hamburger || !sidebar) return;

  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar--open');
  });

  sidebar.addEventListener('click', (e) => {
    if (e.target.classList.contains('sidebar__link')) {
      sidebar.classList.remove('sidebar--open');
    }
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  buildSidebar();
  buildPageNav();
  setupCopyButtons();
  setupHamburger();
});

import type { Section, Topic } from "./roadmap";

/**
 * Roadmap "Conhecendo o Claude" — trilha separada das lentes QA/Agilidade.
 * Objetivo: deixar os times prontos para usar todo o ecossistema Claude
 * (app, Claude Code, plataforma/API, MCP, agentes) e preparar o caminho
 * para uma futura certificação via Anthropic Academy.
 *
 * Convenções:
 * - Todos os ids têm prefixo "claude-" (progresso compartilha a tabela
 *   `progress` sem colidir com o roadmap principal).
 * - Nesta trilha os campos whyQA/qaExample são exibidos como
 *   "Por que importa para o time" / "Exemplo aplicado" (ver TopicDetail).
 */
export const CLAUDE_ROADMAP: Section[] = [
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "claude-fundamentos",
    level: "basico",
    title: "Fundamentos do Claude",
    subtitle: "O que é o Claude, quem é a Anthropic e o essencial do app.",
    goal: "Você sabe o que é o Claude, escolhe o modelo certo para cada tarefa e usa o app com Projects e Artifacts no dia a dia.",
    topics: [
      {
        id: "claude-anthropic",
        title: "Claude e Anthropic: quem é quem",
        short: "A empresa, a missão de segurança e o assistente.",
        level: "basico",
        tags: ["claude", "fundamento"],
        whatIsIt:
          "Claude é a família de assistentes de IA da Anthropic, empresa de pesquisa em segurança de IA. O diferencial da casa é treinar modelos para serem úteis, honestos e inofensivos — o caráter do Claude vem de uma 'constituição' de princípios, e a Anthropic mantém times de pesquisa em alinhamento, interpretabilidade e impactos sociais que publicam abertamente.",
        whyQA:
          "Entender quem constrói a ferramenta ajuda a calibrar confiança: o Claude é desenhado para admitir incerteza e recusar o que não deve fazer. Para o time, isso significa um assistente mais previsível — e uma empresa cujo material público (pesquisa, engenharia, cursos) é fonte primária de aprendizado.",
        qaExample:
          "Antes de adotar o Claude num fluxo do time, você visita anthropic.com/research e a página de engenharia, entende como a empresa pensa segurança e agentes, e usa esse material como referência nas decisões de uso — em vez de aprender só por tentativa e erro.",
        prompt:
          "Explique em termos simples: o que é a Anthropic, o que é a 'constituição' do Claude e como isso influencia o comportamento do assistente no dia a dia (recusas, honestidade, tom).",
        resources: [
          { label: "Anthropic — Research", url: "https://www.anthropic.com/research" },
        ],
      },
      {
        id: "claude-modelos",
        title: "A família de modelos (Opus, Sonnet, Haiku)",
        short: "Qual modelo usar para cada tipo de tarefa.",
        level: "basico",
        tags: ["claude", "modelos", "fundamento"],
        whatIsIt:
          "O Claude vem em famílias com trade-offs claros: Opus (o mais capaz da linha para trabalho profundo e agêntico), Sonnet (equilíbrio de inteligência, velocidade e custo) e Haiku (rápido e econômico para tarefas simples). As gerações atuais têm janelas de contexto enormes (até 1 milhão de tokens) e raciocínio adaptativo — o modelo decide quanto 'pensar' conforme a dificuldade.",
        whyQA:
          "Escolher o modelo certo é a primeira decisão de custo × qualidade em qualquer uso: relatório complexo ou refatoração grande pedem Opus; volume alto de tarefas simples pede Haiku. Quem entende a família não paga caro à toa nem sofre com qualidade insuficiente.",
        qaExample:
          "No Claude Code, o time usa o modelo mais capaz para planejar uma migração de testes e um modelo mais leve para tarefas mecânicas de renomeação. No app, análises longas de documentos vão para o Opus; perguntas rápidas, para modelos mais rápidos. A escolha vira critério consciente, não padrão cego.",
        prompt:
          "Monte uma tabela comparando as famílias Opus, Sonnet e Haiku do Claude: para que tipo de tarefa cada uma é ideal, e 3 exemplos de tarefas do dia a dia de um time de tecnologia para cada família.",
        resources: [
          { label: "Docs — Modelos Claude (visão geral)", url: "https://platform.claude.com/docs/en/about-claude/models/overview" },
        ],
      },
      {
        id: "claude-app",
        title: "Claude.ai no dia a dia",
        short: "Web, desktop e mobile: conversas, anexos e pesquisa.",
        level: "basico",
        tags: ["claude", "app", "produtividade"],
        whatIsIt:
          "O claude.ai é a porta de entrada: conversas com anexos (documentos, planilhas, imagens, PDFs), pesquisa na web, análise de dados e geração de conteúdo — disponível no navegador, desktop e celular. É onde a maioria do time começa, antes de ferramentas técnicas como Claude Code ou API.",
        whyQA:
          "Dominar o app é o degrau zero da adoção: anexar um documento e fazer perguntas, pedir análise de uma planilha, redigir e revisar textos. O ganho de produtividade começa aqui — e os hábitos bons (dar contexto, iterar, verificar) transferem para todas as outras ferramentas Claude.",
        qaExample:
          "Você anexa o PDF de requisitos de uma feature e pede: 'liste ambiguidades e perguntas a fazer no refinamento'. Em outra conversa, cola um CSV de defeitos e pede a análise por módulo. Dez minutos que substituem uma hora de trabalho manual — e o resultado ainda passa pela sua revisão.",
        prompt:
          "Vou te enviar um documento do meu trabalho. Analise e me devolva: (1) resumo em 5 linhas, (2) pontos ambíguos ou faltando, (3) perguntas que eu deveria fazer ao autor. Aguarde o anexo.",
        resources: [
          { label: "Claude — Tutoriais oficiais", url: "https://claude.com/resources/tutorials" },
        ],
      },
      {
        id: "claude-projects",
        title: "Projects: contexto que não se perde",
        short: "Instruções e conhecimento persistentes por projeto.",
        level: "basico",
        tags: ["claude", "app", "contexto"],
        whatIsIt:
          "Projects agrupam conversas em torno de um tema com dois superpoderes: instruções do projeto (como o Claude deve se comportar ali, definido uma vez) e conhecimento do projeto (documentos que ficam disponíveis em todas as conversas). Em vez de re-explicar o contexto a cada chat, você o institucionaliza.",
        whyQA:
          "É a diferença entre 'colar o mesmo contexto toda vez' e ter um espaço de trabalho que já conhece seu produto, seu vocabulário e seus padrões. Para times, Projects padronizam o uso: todo mundo conversa com um Claude que já leu os mesmos documentos-base.",
        qaExample:
          "O time cria o Project 'Produto X' com a spec do produto, o glossário de domínio e o padrão de escrita de casos de teste nas instruções. Qualquer conversa ali já nasce contextualizada — pedir 'gere cenários para a história Y' devolve resultado no padrão do time, sem preâmbulo.",
        prompt:
          "Me ajude a estruturar um Project no Claude para meu time: que instruções colocar (comportamento, formato de respostas, padrões) e que documentos anexar como conhecimento, considerando que trabalhamos com [descreva seu contexto].",
        resources: [
          { label: "Claude — Tutoriais oficiais", url: "https://claude.com/resources/tutorials" },
        ],
      },
      {
        id: "claude-artifacts",
        title: "Artifacts: do texto ao artefato vivo",
        short: "Documentos, diagramas, códigos e mini-apps interativos.",
        level: "basico",
        tags: ["claude", "app", "criacao"],
        whatIsIt:
          "Artifacts são saídas que viram objetos de trabalho: documentos formatados, trechos de código, diagramas, páginas e até mini-aplicações interativas geradas na conversa — que você itera ('muda a cor', 'adiciona um filtro') e compartilha. Transformam o Claude de 'gerador de texto' em construtor de entregáveis.",
        whyQA:
          "Muita coisa que o time produz é artefato: um protótipo de tela, um diagrama de fluxo, um dashboard simples, um formulário de coleta. Com Artifacts, a distância entre 'ideia descrita' e 'coisa clicável para validar' cai para minutos — ótimo para discovery e alinhamento.",
        qaExample:
          "Na discussão de uma feature, você pede um protótipo interativo da tela para o time reagir sobre algo concreto. Em outra frente, gera um diagrama do fluxo de pagamento a partir da descrição textual — e o artefato vira anexo da história no Jira.",
        prompt:
          "Crie um artifact interativo: um formulário simples de triagem de bugs com campos (título, severidade, módulo, passos) e uma lista que mostra os itens adicionados. Visual limpo, tema escuro.",
        resources: [
          { label: "Claude — Tutoriais oficiais", url: "https://claude.com/resources/tutorials" },
        ],
      },
      {
        id: "claude-conectores",
        title: "Connectors: o Claude conectado às suas ferramentas",
        short: "Drive, Gmail, calendário e fontes da empresa na conversa.",
        level: "basico",
        tags: ["claude", "integracao", "app"],
        whatIsIt:
          "Connectors ligam o claude.ai às ferramentas onde o trabalho vive — Google Drive, Gmail, calendário e outros serviços — para o Claude buscar e usar essas informações direto na conversa, com sua permissão. Por baixo, muitos usam MCP, o protocolo aberto de integração do ecossistema.",
        whyQA:
          "O valor do assistente multiplica quando ele enxerga seu contexto real: 'resuma os documentos da pasta do projeto', 'o que ficou combinado no e-mail com o fornecedor?'. Menos copiar-e-colar, mais resposta baseada na fonte. E entender permissões/escopos aqui é o primeiro passo de uso seguro.",
        qaExample:
          "Antes da planning, você pede: 'com base nos documentos da pasta do Drive do projeto, liste decisões em aberto e riscos mencionados'. O Claude busca nos arquivos conectados e devolve um resumo com as fontes — que você confere antes de levar à reunião.",
        prompt:
          "Considerando que conectei meu Google Drive, busque nos documentos do projeto [nome] e me traga: decisões registradas, pendências citadas e qualquer prazo mencionado. Liste a fonte (nome do arquivo) de cada item.",
        resources: [
          { label: "Claude — Tutoriais oficiais", url: "https://claude.com/resources/tutorials" },
        ],
      },
      {
        id: "claude-memoria",
        title: "Memória: o Claude que lembra de você",
        short: "Contexto que persiste entre conversas — com você no controle.",
        level: "basico",
        tags: ["claude","app","contexto"],
        whatIsIt:
          "O claude.ai pode lembrar informações entre conversas — seu papel, suas preferências, os projetos em andamento — para você não recomeçar do zero a cada chat. A memória é transparente e controlável: você vê o que foi lembrado, edita, apaga, e pode usar conversas avulsas que não geram memória quando quiser.",
        whyQA:
          "Sem memória, todo chat repete o ritual de contexto ('trabalho no time X, uso o padrão Y...'). Com ela, o assistente evolui com você — e o time precisa entender os controles: o que deixar lembrar, o que revisar e quando usar conversas sem memória (assuntos sensíveis, testes limpos).",
        qaExample:
          "Depois de semanas de uso, o Claude já sabe que você trabalha com automação em Playwright e prefere respostas diretas em tabela. Um pedido curto ('revisa esse cenário') já vem no seu padrão. Antes de tratar um dado sensível, você abre uma conversa avulsa — memória é ferramenta, não vigilância.",
        prompt:
          "O que você lembra sobre mim e meu trabalho? Liste o que está na sua memória, aponte o que parece desatualizado e me pergunte o que devo corrigir ou apagar.",
        resources: [
          { label: "Claude — Tutoriais oficiais", url: "https://claude.com/resources/tutorials" },
        ],
      },
      {
        id: "claude-pesquisa",
        title: "Pesquisa e Deep Research no app",
        short: "O Claude que investiga em várias fontes e entrega relatório citado.",
        level: "basico",
        tags: ["claude","app","pesquisa"],
        whatIsIt:
          "Além de responder do conhecimento próprio, o claude.ai pesquisa na web — e no modo de pesquisa aprofundada, decompõe sua pergunta, investiga múltiplas fontes, cruza os achados e entrega um relatório estruturado com citações. É o padrão 'deep research' pronto para usar, sem escrever uma linha de código.",
        whyQA:
          "Levantamentos que tomavam uma tarde (comparar ferramentas, mapear práticas de mercado, reunir contexto para uma decisão) saem em minutos — com fontes para conferir. A habilidade que importa é a de sempre: tratar o relatório como rascunho forte e auditar as citações-chave antes de decidir.",
        qaExample:
          "Antes de propor uma ferramenta nova ao time, você pede uma pesquisa aprofundada: 'compare as 3 principais opções para X, com prós, contras, preços públicos e fontes'. O relatório chega citado; você confere as 4 fontes mais importantes e leva à discussão uma base sólida — não um palpite.",
        prompt:
          "Faça uma pesquisa aprofundada: [tema relevante para seu time]. Estruture o resultado com: resumo executivo, comparação em tabela, riscos/atenções e lista de fontes. Sinalize onde as fontes divergem entre si.",
        resources: [
          { label: "Claude — Tutoriais oficiais", url: "https://claude.com/resources/tutorials" },
        ],
      },
      {
        id: "claude-multimodal",
        title: "Multimodal na prática: prints, fotos e PDFs",
        short: "O Claude enxerga — use isso todos os dias.",
        level: "basico",
        tags: ["claude","app","visao"],
        whatIsIt:
          "Os modelos Claude entendem imagens e documentos: cole um print de erro, uma foto do quadro branco da reunião, um diagrama de arquitetura ou um PDF escaneado, e converse sobre o conteúdo — extrair, explicar, criticar, transformar em texto estruturado. Funciona no app, no Claude Code e na API.",
        whyQA:
          "Metade do contexto do dia a dia é visual: telas com defeito, fluxos desenhados, planilhas fotografadas. Quem descreve em texto o que poderia colar como imagem perde tempo e precisão — o print do erro carrega detalhes que a descrição esquece.",
        qaExample:
          "Um bug intermitente aparece e você cola o print da tela + o trecho do log: 'o que esse estado sugere e que hipóteses investigar primeiro?'. Em outra frente, a foto do quadro da retro vira, num pedido, a ata estruturada com ações e responsáveis.",
        prompt:
          "Vou colar uma imagem (print de tela, diagrama ou foto de quadro). Analise e devolva: o que você vê, o que parece errado ou incompleto, e 3 perguntas que eu deveria fazer a partir dela. Aguarde a imagem.",
        resources: [
          { label: "Claude — Tutoriais oficiais", url: "https://claude.com/resources/tutorials" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "claude-trabalho",
    level: "basico",
    title: "Claude no trabalho em equipe",
    subtitle: "Instruções eficazes, Skills reutilizáveis e trabalho colaborativo.",
    goal: "Você escreve instruções que funcionam, empacota conhecimento do time em Skills e conhece o Claude para trabalho colaborativo.",
    topics: [
      {
        id: "claude-instrucoes",
        title: "Instruções eficazes para o Claude",
        short: "Contexto, formato e exemplos: o jeito Claude de pedir.",
        level: "basico",
        tags: ["claude", "prompt", "tecnica"],
        whatIsIt:
          "O Claude responde melhor a pedidos com três ingredientes: contexto (quem você é, para quê), formato desejado (estrutura, tamanho, tom) e exemplos do resultado esperado. Ele segue instruções literalmente e com fidelidade — o que torna instruções bem escritas um superpoder, e instruções vagas um desperdício.",
        whyQA:
          "É a habilidade-base que todos os usos derivam: app, Claude Code, API. Times que padronizam bons pedidos (em Projects, Skills ou CLAUDE.md) obtêm resultados consistentes entre pessoas — o conhecimento de 'pedir bem' deixa de ser individual.",
        qaExample:
          "Em vez de 'melhora esse texto', o pedido vira: 'Você é revisor técnico. Reescreva este release note para usuários finais: máximo 5 bullets, sem jargão, cada bullet começando com verbo. Exemplo do tom: [exemplo]'. O resultado sai pronto na primeira, não na quinta tentativa.",
        prompt:
          "Analise este pedido que eu faria a uma IA: '[cole um pedido seu]'. Aponte o que falta (contexto? formato? exemplo?) e reescreva-o na versão ideal, explicando cada melhoria.",
        resources: [
          { label: "Anthropic Academy — cursos oficiais", url: "https://anthropic.skilljar.com/" },
        ],
      },
      {
        id: "claude-skills",
        title: "Skills: conhecimento do time empacotado",
        short: "Procedimentos reutilizáveis que o Claude carrega quando precisa.",
        level: "basico",
        tags: ["claude", "skills", "padrao"],
        whatIsIt:
          "Uma Skill é um pacote de instruções (e arquivos de apoio) que ensina o Claude a executar uma tarefa do seu jeito — de formatar planilhas e apresentações a seguir o processo interno do time. O Claude carrega a Skill sob demanda, quando a tarefa pede. Existem Skills prontas da Anthropic (Excel, Word, PowerPoint, PDF) e Skills próprias, e elas funcionam no app, no Claude Code e na API.",
        whyQA:
          "Skills transformam 'o jeito que a gente faz' em ativo versionado e compartilhável: escreva uma vez o procedimento de análise de bug ou o padrão de relatório, e todo o time (e todo agente) passa a executá-lo igual. É o antídoto para resultados que variam conforme quem pediu.",
        qaExample:
          "O time cria a Skill 'relatório semanal de qualidade': estrutura, métricas obrigatórias e tom. Toda sexta, qualquer pessoa pede 'gere o relatório da semana com os dados X' e sai no padrão — no app ou no Claude Code. O curso oficial 'Introduction to Agent Skills' ensina a construir as suas.",
        prompt:
          "Me ajude a rascunhar uma Skill para o Claude: tarefa = [descreva um procedimento repetitivo do seu time]. Estruture: nome, quando usar, instruções passo a passo e um exemplo de saída ideal.",
        resources: [
          { label: "Anthropic Academy — Introduction to Agent Skills", url: "https://anthropic.skilljar.com/" },
        ],
      },
      {
        id: "claude-cowork",
        title: "Claude Cowork: delegando trabalho de verdade",
        short: "O Claude como colega que executa tarefas com seus arquivos.",
        level: "basico",
        tags: ["claude", "produtividade", "tendencia"],
        whatIsIt:
          "Cowork é a evolução do chat para o trabalho delegado: você entrega uma tarefa ('organize estes arquivos e produza o relatório'), dá acesso ao material e o Claude trabalha nela — usando arquivos, plugins e fluxos de pesquisa — enquanto você acompanha. É o Claude operando como colega de trabalho, não só respondendo perguntas.",
        whyQA:
          "Muda o modelo mental de 'perguntar' para 'delegar com supervisão': tarefas inteiras (compilar dados, montar apresentação, pesquisa comparativa) saem da sua fila. A habilidade nova é especificar bem a tarefa e revisar o resultado — exatamente o músculo que o roadmap inteiro desenvolve.",
        qaExample:
          "Você delega: 'analise estes 8 arquivos de resultados de teste, identifique padrões de falha e produza um resumo executivo com gráficos'. Vai fazer outra coisa e volta para revisar o entregável — em vez de passar a tarde compilando manualmente. O curso 'Introduction to Claude Cowork' cobre o fluxo.",
        prompt:
          "Tenho a seguinte tarefa para delegar: [descreva]. Me ajude a escrevê-la como uma boa delegação: objetivo, materiais que fornecerei, formato do entregável, critérios de 'bem feito' e o que você deve me perguntar antes de começar.",
        resources: [
          { label: "Anthropic Academy — Introduction to Claude Cowork", url: "https://anthropic.skilljar.com/" },
        ],
      },
      {
        id: "claude-analise-dados",
        title: "Análise de dados: do CSV ao insight",
        short: "Suba a planilha; o Claude escreve e roda o código da análise.",
        level: "basico",
        tags: ["claude","dados","produtividade"],
        whatIsIt:
          "No claude.ai, a ferramenta de análise permite subir arquivos de dados (CSV, planilhas) e pedir a análise em linguagem natural: o Claude escreve e executa código de verdade para calcular, cruzar e visualizar — e devolve gráficos e conclusões que você refina conversando ('agora por mês', 'só o módulo X').",
        whyQA:
          "Todo time nada em dados que ninguém analisa: exports de ferramenta, resultados de execução, métricas de fluxo. A barreira era saber a ferramenta de análise — agora é saber a pergunta. Quem pergunta bem transforma qualquer export em decisão.",
        qaExample:
          "Você exporta o histórico de defeitos do trimestre e sobe o CSV: 'quais módulos concentram reincidência? Mostre a tendência mensal em gráfico'. Três refinamentos depois, tem o material da retro — sem abrir planilha nem escrever fórmula.",
        prompt:
          "Vou subir um CSV com dados do meu time. Explore-o e me devolva: (1) 3 padrões que chamam atenção, (2) um gráfico da tendência principal, (3) 2 perguntas que os dados levantam mas não respondem. Aguarde o arquivo.",
        resources: [
          { label: "Claude — Tutoriais oficiais", url: "https://claude.com/resources/tutorials" },
        ],
      },
      {
        id: "claude-fluency",
        title: "AI Fluency: os 4 Ds da colaboração com IA",
        short: "Delegação, Descrição, Discernimento e Diligência.",
        level: "basico",
        tags: ["claude","cultura","fundamento"],
        whatIsIt:
          "AI Fluency é o framework da Anthropic para colaborar bem com IA, organizado em 4 competências: Delegação (escolher o que dar à IA e o que manter), Descrição (comunicar bem o que você quer), Discernimento (avaliar criticamente o que volta) e Diligência (usar com responsabilidade e transparência). A família de cursos na Academy cobre do profissional ao educador.",
        whyQA:
          "É o vocabulário comum que faltava para o time falar de uso de IA: em vez de 'fulano usa bem, sicrano não', os 4 Ds dão critérios observáveis para treinar e avaliar. Discernimento e Diligência, em particular, são o coração do uso profissional — e conectam com tudo que este roadmap ensina.",
        qaExample:
          "Na retro de adoção de IA, o time se avalia pelos 4 Ds: estamos delegando as tarefas certas? Nossas descrições têm contexto e critério de pronto? Estamos revisando com rigor (discernimento) e sinalizando o que foi feito com IA (diligência)? Os gaps viram ações do próximo ciclo.",
        prompt:
          "Explique o framework AI Fluency (4 Ds: Delegação, Descrição, Discernimento, Diligência) e me ajude a autoavaliar: para cada D, 3 perguntas de reflexão e um exemplo de comportamento bom vs ruim no trabalho com IA.",
        resources: [
          { label: "Anthropic Academy — AI Fluency", url: "https://anthropic.skilljar.com/" },
        ],
      },
      {
        id: "claude-prompting-avancado",
        title: "Prompting avançado no estilo Claude",
        short: "XML tags, papéis, exemplos e documentos longos.",
        level: "basico",
        tags: ["claude","prompt","tecnica"],
        whatIsIt:
          "As técnicas que a própria Anthropic ensina para extrair o máximo do Claude: estruturar prompts com tags XML (<contexto>, <exemplo>, <instrucoes>) para separar as partes sem ambiguidade, definir papéis, dar exemplos do resultado (few-shot), posicionar documentos longos antes da pergunta e pedir raciocínio passo a passo quando a tarefa é complexa. Há um tutorial interativo oficial e uma biblioteca de prompts prontos.",
        whyQA:
          "É o degrau entre 'pedir bem' e 'engenharia de verdade': prompts estruturados são mais fáceis de manter, versionar e compartilhar — e falham menos. Para quem escreve Skills, comandos de time e integrações, essas técnicas são a matéria-prima.",
        qaExample:
          "O prompt de geração de casos de teste do time vira um template com <historia>, <criterios>, <exemplo_de_saida> — e a taxa de saídas fora do padrão despenca. Quando alguém precisa ajustar, mexe na tag certa em vez de reescrever o parágrafo inteiro.",
        prompt:
          "Reescreva este prompt usando as técnicas avançadas do Claude (tags XML para estruturar, papel definido, um exemplo de saída): '[cole um prompt que seu time usa]'. Explique cada mudança e o problema que ela evita.",
        resources: [
          { label: "Docs — Plataforma Claude (prompting)", url: "https://platform.claude.com/docs" },
        ],
      },
      {
        id: "claude-skills-nativas",
        title: "Skills nativas a fundo: Excel, Word, PowerPoint e PDF",
        short: "O Claude gerando arquivos de verdade, no padrão profissional.",
        level: "basico",
        tags: ["claude","skills","produtividade"],
        whatIsIt:
          "A Anthropic mantém Skills prontas para os formatos de escritório: xlsx (planilhas com fórmulas e formatação), docx (documentos), pptx (apresentações) e pdf. Com elas, o Claude não descreve o arquivo — ele o produz de verdade, para download, seguindo boas práticas de cada formato. Funcionam no app, no Claude Cowork, no Claude Code e na API, e carregam automaticamente quando a tarefa envolve o formato.",
        whyQA:
          "É a ponte entre 'o Claude escreveu o conteúdo' e 'o entregável está pronto': o relatório sai como .docx formatado, a análise como .xlsx com abas e fórmulas, a apresentação como .pptx. Elimina a etapa manual de transpor conteúdo para o formato final — onde muito tempo (e formatação) se perdia.",
        qaExample:
          "Você pede: 'transforme esta análise de defeitos numa apresentação de 6 slides para a diretoria' e recebe o .pptx pronto — títulos, gráficos, notas do apresentador. Na sequência, 'agora o detalhamento em planilha, uma aba por módulo, com totais' — e o .xlsx chega com fórmulas, não números colados.",
        prompt:
          "Gere uma planilha (.xlsx) de acompanhamento de testes com: aba 'Casos' (id, título, módulo, status, responsável), aba 'Resumo' com totais por status usando fórmulas, e formatação condicional de status. Dados de exemplo: 10 casos fictícios.",
        resources: [
          { label: "Anthropic Academy — Introduction to Agent Skills", url: "https://anthropic.skilljar.com/" },
        ],
      },
      {
        id: "claude-cowork-fundo",
        title: "Cowork a fundo: pastas, paralelismo e revisão",
        short: "Extraindo o máximo do colega digital: acesso, fluxo e controle.",
        level: "basico",
        tags: ["claude","produtividade","fluxo"],
        whatIsIt:
          "Usar bem o Cowork é dominar seu fluxo de trabalho: dar acesso às pastas certas (o Claude trabalha nos SEUS arquivos, criando e organizando de verdade), combinar Skills nativas e conectores na mesma tarefa, manter várias tarefas andando em paralelo e usar os pontos de revisão — o Claude mostra o plano e os resultados parciais para você direcionar antes de seguir. Delegação com supervisão, não piloto automático.",
        whyQA:
          "A diferença entre 'testei o Cowork' e 'o Cowork virou meu braço direito' está nesses detalhes: escopo de pasta bem dado (acesso ao que precisa, não a tudo), tarefas descritas com critério de pronto, revisão nos checkpoints em vez de só no final. Quem opera assim multiplica a capacidade sem perder o controle.",
        qaExample:
          "Você aponta o Cowork para a pasta do release: 'organize as evidências de teste por módulo, gere o índice em planilha e o sumário executivo em documento'. Enquanto ele trabalha nessa, uma segunda tarefa compila as métricas da sprint. Você revisa os planos, ajusta um detalhe no meio e recebe os dois entregáveis prontos.",
        prompt:
          "Me ajude a planejar uma tarefa para o Claude Cowork: [descreva um trabalho com arquivos]. Estruture: pastas que devo dar acesso (e o que deixar de fora), instrução com critério de pronto, em que pontos quero revisar antes de continuar e formato dos entregáveis.",
        resources: [
          { label: "Anthropic Academy — Introduction to Claude Cowork", url: "https://anthropic.skilljar.com/" },
          { label: "Claude — Tutoriais oficiais", url: "https://claude.com/resources/tutorials" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "claude-code-secao",
    level: "intermediario",
    title: "Claude Code",
    subtitle: "O agente de engenharia no terminal, na IDE e no CI do time.",
    goal: "Você instala, configura e usa o Claude Code com CLAUDE.md, skills, subagentes e hooks — e o integra ao fluxo do time.",
    topics: [
      {
        id: "claude-code",
        title: "O que é o Claude Code",
        short: "Um agente que lê, edita, testa e executa no seu repositório.",
        level: "intermediario",
        tags: ["claude-code", "agente", "dev"],
        whatIsIt:
          "Claude Code é o agente de engenharia da Anthropic: roda no terminal, em IDEs (VS Code, JetBrains), no desktop e na web, com acesso real ao repositório — lê e edita arquivos, roda comandos e testes, faz buscas e commits. Você descreve a tarefa; ele planeja, executa em passos e mostra o que fez, pedindo permissão para ações sensíveis.",
        whyQA:
          "É a ferramenta que transforma 'IA que sugere código' em 'IA que executa tarefas de engenharia': escrever e rodar testes, investigar bugs, refatorar, automatizar rotinas. Para times de qualidade e agilidade, é também um executor de automações que antes exigiam script próprio.",
        qaExample:
          "Você abre o Claude Code no repositório de automação e pede: 'os testes do fluxo de login estão quebrando desde ontem; investigue e proponha a correção'. Ele lê os testes, roda a suíte, encontra o seletor alterado, corrige e mostra o diff — você revisa e aprova. O curso oficial 'Claude Code in Action' cobre esse fluxo de ponta a ponta.",
        prompt:
          "Explique o que é o Claude Code e monte um plano de primeira semana para um time adotá-lo: 3 tarefas seguras para começar, 3 cuidados de permissão/revisão e como medir se está ajudando.",
        resources: [
          { label: "Anthropic Academy — Claude Code in Action", url: "https://anthropic.skilljar.com/claude-code-in-action" },
          { label: "Docs — Claude Code", url: "https://code.claude.com/docs" },
        ],
      },
      {
        id: "claude-code-setup",
        title: "Setup, permissões e modos de trabalho",
        short: "Instalar, logar e controlar o que o agente pode fazer.",
        level: "intermediario",
        tags: ["claude-code", "setup", "seguranca"],
        whatIsIt:
          "O Claude Code se instala em minutos (terminal ou IDE) e o essencial da configuração é o controle de permissões: por padrão ele pede aprovação para ações com efeito (editar arquivos, rodar comandos), e você calibra o nível de autonomia por projeto — de 'pergunte tudo' a modos mais autônomos para tarefas confiáveis, além do modo de planejamento para revisar a estratégia antes de qualquer edição.",
        whyQA:
          "Permissão é a fronteira entre produtividade e susto: um time que entende os modos usa autonomia alta onde é seguro (rascunhos, branch isolada) e aprovação estrita onde importa (produção, arquivos sensíveis). Configurar bem é o que permite confiar.",
        qaExample:
          "No repositório de testes, o time libera edições sem aprovação (tudo passa por PR de qualquer forma); no repositório de infraestrutura, mantém aprovação comando a comando. Antes de refatorações grandes, usam o modo de planejamento: o Claude apresenta o plano, o time ajusta, e só então executa.",
        prompt:
          "Proponha uma política de permissões do Claude Code para meu time: quais ações podem ser automáticas, quais exigem aprovação e quais são proibidas, considerando repositórios de [teste/produto/infra]. Formate como acordo de trabalho de uma página.",
        resources: [
          { label: "Docs — Claude Code", url: "https://code.claude.com/docs" },
        ],
      },
      {
        id: "claude-code-claude-md",
        title: "CLAUDE.md: a memória do projeto",
        short: "Convenções e contexto que o agente lê antes de trabalhar.",
        level: "intermediario",
        tags: ["claude-code", "contexto", "padrao"],
        whatIsIt:
          "CLAUDE.md é um arquivo versionado no repositório que o Claude Code lê automaticamente: arquitetura do projeto, convenções, comandos de build e teste, o que nunca fazer. É o equivalente do AGENTS.md — o conhecimento tribal do time vira contexto permanente do agente, revisável em code review como qualquer código.",
        whyQA:
          "Sem ele, cada sessão recomeça do zero e cada pessoa obtém um agente diferente; com ele, o agente já sabe rodar a suíte certa, seguir o padrão de nomenclatura e respeitar as regras do projeto. É a peça nº 1 de consistência para uso em time.",
        qaExample:
          "O CLAUDE.md do repositório de automação diz: 'testes em Playwright/TypeScript, padrão AAA, seletores por data-testid; rode npm test antes de concluir; nunca toque na pasta /legacy'. A partir daí, qualquer tarefa pedida por qualquer pessoa já respeita o contrato — sem repetir instruções.",
        prompt:
          "Gere um modelo de CLAUDE.md para um repositório de [descreva seu projeto]: seções de visão geral, comandos essenciais, convenções de código, padrões de teste e proibições. Preencha com placeholders claros para eu adaptar.",
        resources: [
          { label: "Docs — Claude Code", url: "https://code.claude.com/docs" },
        ],
      },
      {
        id: "claude-code-comandos",
        title: "Slash commands e Skills no Claude Code",
        short: "Rotinas do time viram comandos de uma linha.",
        level: "intermediario",
        tags: ["claude-code", "skills", "automacao"],
        whatIsIt:
          "Além do CLAUDE.md, o Claude Code aceita comandos personalizados (/nome) e Skills: procedimentos empacotados que qualquer pessoa invoca com uma linha — '/revisar-pr', '/gerar-teste', '/relatorio-cobertura'. A rotina descrita uma vez vira ferramenta compartilhada do repositório, com a mesma qualidade para todos.",
        whyQA:
          "É a industrialização das tarefas repetitivas: a diferença entre 'cada um pede a revisão do seu jeito' e '/revisar-pr roda o checklist oficial do time'. Skills bem escritas capturam o processo — e evoluem por PR, como código.",
        qaExample:
          "O time cria '/plano-de-teste' que recebe o link da história e devolve o plano no padrão da casa, e '/triagem' que analisa um bug novo e sugere severidade, módulo e responsável. Rotinas que consumiam 20 minutos viram um comando — com resultado uniforme.",
        prompt:
          "Liste 5 rotinas repetitivas de um time de qualidade/agilidade que valem virar slash commands do Claude Code. Para a mais valiosa, escreva o conteúdo completo do comando: instruções, entradas esperadas e formato de saída.",
        resources: [
          { label: "Anthropic Academy — Introduction to Agent Skills", url: "https://anthropic.skilljar.com/" },
        ],
      },
      {
        id: "claude-code-subagentes",
        title: "Subagentes: trabalho em paralelo com contexto limpo",
        short: "O agente principal delega; especialistas executam.",
        level: "intermediario",
        tags: ["claude-code", "subagentes", "arquitetura"],
        whatIsIt:
          "No Claude Code, o agente principal pode despachar subagentes — instâncias com contexto e instruções próprios — para tarefas específicas, inclusive em paralelo: um varre o código atrás de um padrão, outro roda a análise de segurança, outro escreve testes. Cada um trabalha no seu recorte e devolve só a conclusão, mantendo o contexto principal limpo. Você pode definir subagentes personalizados do time (revisor, gerador de testes) em arquivos versionados.",
        whyQA:
          "Paralelismo com isolamento é o que permite tarefas grandes sem degradação: revisões multi-dimensão, migrações em lote, investigações amplas. E subagentes 'céticos' que verificam o trabalho dos outros são o padrão de qualidade mais poderoso do agentic coding.",
        qaExample:
          "Para revisar um release, o time dispara 3 subagentes em paralelo — segurança, performance e regressão de contratos — e um quarto que tenta refutar os achados dos três antes do relatório final. O curso oficial 'Introduction to Subagents' ensina a estruturar isso.",
        prompt:
          "Desenhe um subagente personalizado de 'revisor de testes' para o Claude Code: nome, quando o agente principal deve acioná-lo, instruções (o que verificar num teste: asserções, independência, nomes, cobertura de borda) e formato do parecer.",
        resources: [
          { label: "Anthropic Academy — Introduction to Subagents", url: "https://anthropic.skilljar.com/" },
        ],
      },
      {
        id: "claude-code-hooks",
        title: "Hooks e automação: o Claude Code sem ninguém olhando",
        short: "Gatilhos automáticos e execução em CI/pipelines.",
        level: "intermediario",
        tags: ["claude-code", "automacao", "ci"],
        whatIsIt:
          "Hooks são gatilhos que rodam comandos seus em momentos-chave do Claude Code (antes/depois de editar, ao concluir tarefa) — ex.: rodar lint e testes após cada edição, bloquear mudanças em pastas proibidas. E o modo não-interativo (headless) permite usar o Claude Code em scripts e CI: revisar PRs automaticamente, triar issues, gerar relatórios — o agente como etapa de pipeline.",
        whyQA:
          "Hooks transformam 'boas práticas que dependem de lembrar' em automação garantida; o modo headless leva o agente para onde o time já automatiza (CI/CD). Juntos, permitem qualidade que roda sozinha — com os mesmos controles de permissão.",
        qaExample:
          "O time configura um hook que roda a suíte afetada após cada edição do agente (edição que quebra teste nem chega a você) e um job de CI em que o Claude Code analisa todo PR aberto e comenta riscos — antes da revisão humana, não no lugar dela.",
        prompt:
          "Proponha 3 hooks úteis do Claude Code para um repositório com testes automatizados (gatilho → comando → objetivo) e um esboço de job de CI usando o modo não-interativo para revisar PRs. Inclua os cuidados de segurança.",
        resources: [
          { label: "Docs — Claude Code", url: "https://code.claude.com/docs" },
        ],
      },
      {
        id: "claude-code-time",
        title: "Claude Code em time: fluxo, GitHub e boas práticas",
        short: "Do uso individual ao fluxo de trabalho compartilhado.",
        level: "intermediario",
        tags: ["claude-code", "processo", "time"],
        whatIsIt:
          "Usar bem em time é mais que instalar: é padronizar o CLAUDE.md e as Skills no repositório, integrar com GitHub (o agente abre PRs, responde revisões, trabalha em issues), combinar quando usar autonomia versus aprovação e revisar o trabalho do agente como se revisa o de um colega. O curso 'Claude Code in Action' fecha exatamente esse ciclo: controlar contexto, guiar o trabalho, automatizar o repetitivo e verificar/compartilhar.",
        whyQA:
          "O ganho real aparece quando o agente entra no fluxo do time — com convenções compartilhadas, integração ao versionamento e revisão disciplinada. Sem isso, vira dez usos individuais inconsistentes; com isso, vira capacidade do time.",
        qaExample:
          "O time adota o ritual: toda tarefa de agente nasce de uma issue, roda em branch própria, passa pelos hooks de teste e vira PR revisado por humano. Em um mês, tarefas mecânicas (atualizar seletores, cobrir função nova, corrigir flaky simples) rodam nesse trilho — e a retro avalia o que ampliar.",
        prompt:
          "Monte um 'guia de adoção do Claude Code' de uma página para meu time: pré-requisitos, convenções (CLAUDE.md, branches, PRs), o que pode ser autônomo, o que exige revisão e como medir o impacto em 30 dias.",
        resources: [
          { label: "Anthropic Academy — Claude Code in Action", url: "https://anthropic.skilljar.com/claude-code-in-action" },
        ],
      },
      {
        id: "claude-code-web",
        title: "Claude Code além do terminal",
        short: "Web, desktop e sessões na nuvem — o agente onde você estiver.",
        level: "intermediario",
        tags: ["claude-code","produtividade"],
        whatIsIt:
          "O Claude Code não vive só no terminal: há o app desktop, a integração com IDEs e a versão web, em que sessões rodam em infraestrutura na nuvem conectadas ao seu repositório — você dispara uma tarefa do navegador, acompanha o progresso (inclusive do celular) e revisa o resultado depois. Tarefas paralelas deixam de depender da sua máquina aberta.",
        whyQA:
          "Muda o modelo de uso: em vez de 'sentar e pilotar', você despacha tarefas (corrigir um teste, preparar um refactor, investigar um bug) e revisa quando prontas — inclusive várias em paralelo. É a ponte natural para o time tratar o agente como colega assíncrono.",
        qaExample:
          "Antes de entrar em reunião, você dispara pela web: 'atualize os seletores quebrados do módulo de checkout e rode a suíte'. Sai da reunião, o resultado está pronto para revisão em PR — a tarefa andou enquanto você estava ocupado.",
        prompt:
          "Explique as formas de usar o Claude Code (terminal, IDE, desktop, web com sessões na nuvem) e monte um guia rápido: que tipo de tarefa combina com cada superfície, e 3 exemplos de tarefas boas para despachar em sessão remota.",
        resources: [
          { label: "Docs — Claude Code", url: "https://code.claude.com/docs" },
        ],
      },
      {
        id: "claude-github",
        title: "@claude no GitHub: o agente nos PRs e issues",
        short: "Mencione o Claude no PR e ele trabalha — direto no CI.",
        level: "intermediario",
        tags: ["claude-code","github","automacao"],
        whatIsIt:
          "Com a integração oficial para GitHub Actions, o Claude vira participante do repositório: mencione @claude num comentário de PR ou issue e ele responde — analisa o código, implementa a mudança pedida, corrige o teste, abre o PR. Roda na infraestrutura de CI do próprio repositório, com permissões que o time configura.",
        whyQA:
          "É a automação que encontra o time onde ele já trabalha: ninguém precisa abrir terminal — o fluxo de revisão e correção acontece no GitHub. 'Issues mecânicas' (ajustes pequenos, correções óbvias, perguntas sobre o código) ganham um executor de plantão.",
        qaExample:
          "Num PR, o revisor comenta: '@claude esse teste novo não cobre o caso de valor nulo — adicione'. Minutos depois, o commit com o caso extra aparece no PR. Numa issue de bug simples, '@claude investigue e proponha a correção' devolve análise e um PR vinculado.",
        prompt:
          "Explique como funciona a integração do Claude com GitHub Actions (@claude em PRs e issues): o que ele consegue fazer, como as permissões são controladas e 5 usos seguros para um time começar. Inclua os cuidados (revisão humana, escopo do token).",
        resources: [
          { label: "GitHub — claude-code-action (oficial)", url: "https://github.com/anthropics/claude-code-action" },
          { label: "Docs — Claude Code", url: "https://code.claude.com/docs" },
        ],
      },
      {
        id: "claude-code-cli-guia",
        title: "Guia power user da CLI: comandos e atalhos nativos",
        short: "/init, /compact, /rewind, @arquivo, !bash — o teclado do agente.",
        level: "intermediario",
        tags: ["claude-code","cli","produtividade"],
        whatIsIt:
          "O Claude Code vem cheio de comandos nativos que a maioria não explora: /init (gera o CLAUDE.md do projeto), /compact (resume a conversa para liberar contexto), /clear (recomeça), /model (troca o modelo), /permissions (ajusta o que pode sem perguntar), /mcp (gerencia servidores conectados), /agents (subagentes), /review (revisão de código), /cost (quanto a sessão consumiu), /resume (retoma sessões anteriores), /rewind (volta a um ponto anterior via checkpoints), /doctor (diagnóstico) — além de atalhos: @arquivo para mencionar arquivos, ! para rodar bash direto, # para adicionar algo à memória do projeto, Esc para interromper e Shift+Tab para alternar os modos (normal, auto-aceitar, planejamento). O /help lista tudo.",
        whyQA:
          "A produtividade real da ferramenta mora nesses detalhes: quem usa /compact em sessões longas mantém o agente afiado; quem domina /rewind experimenta sem medo; quem usa @arquivo e !comando conversa com precisão. É a diferença entre dirigir no automático e pilotar.",
        qaExample:
          "Sessão longa de refatoração: o contexto encheu e as respostas pioraram — /compact resolve. O agente tomou um caminho ruim há três passos — /rewind volta ao checkpoint e você redireciona. Quer saber o custo da brincadeira — /cost. Precisa citar o arquivo exato — '@tests/login.spec.ts está falhando, investigue'.",
        prompt:
          "Monte uma 'cola de bolso' do Claude Code para meu time: os 12 comandos e atalhos nativos mais úteis (o que faz cada um + quando usar), organizados por situação: começando um projeto, sessão longa, corrigindo rumo, controlando custo e permissões.",
        resources: [
          { label: "Docs — Claude Code", url: "https://code.claude.com/docs" },
          { label: "Anthropic Academy — Claude Code in Action", url: "https://anthropic.skilljar.com/claude-code-in-action" },
        ],
      },
      {
        id: "claude-code-headless",
        title: "CLI programável: headless, sessões e configuração fina",
        short: "claude -p, continue/resume, settings.json e a pasta .claude.",
        level: "intermediario",
        tags: ["claude-code","cli","automacao"],
        whatIsIt:
          "A CLI do Claude Code é programável: `claude -p \"tarefa\"` roda em modo não-interativo (headless) e devolve o resultado — inclusive em JSON — para scripts e pipelines; `claude -c` continua a última sessão e `claude --resume` reabre qualquer sessão anterior. A configuração fina vive na pasta .claude do projeto: settings.json (permissões e hooks versionados do time), commands/ (slash commands próprios), agents/ (subagentes) e o CLAUDE.md — além das versões globais no diretório do usuário. E `claude mcp add` conecta servidores MCP pela linha de comando.",
        whyQA:
          "É o que transforma o Claude Code de ferramenta interativa em bloco de construção: o mesmo agente que você usa no terminal roda em cron, CI ou script do time — com a configuração versionada no repositório, igual para todos. Time que domina a pasta .claude compartilha superpoderes por git.",
        qaExample:
          "O time versiona .claude/settings.json (permissões e um hook que roda a suíte após edições) e .claude/commands/triagem.md. No CI, um passo roda `claude -p` para analisar o diff do PR e comentar riscos em JSON estruturado. Novato clona o repositório e já herda tudo — zero setup manual.",
        prompt:
          "Explique o modo headless do Claude Code (claude -p) e a estrutura da pasta .claude (settings.json, commands/, agents/, CLAUDE.md). Depois desenhe: um script de exemplo para CI que usa claude -p com saída JSON, e o que o time deveria versionar no repositório.",
        resources: [
          { label: "Docs — Claude Code", url: "https://code.claude.com/docs" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "claude-plataforma",
    level: "avancado",
    title: "Plataforma & API",
    subtitle: "Construir produtos e automações com o Claude por baixo.",
    goal: "Você entende a API do Claude (mensagens, ferramentas, saídas estruturadas, custo) e sabe quando usar o Agent SDK.",
    topics: [
      {
        id: "claude-api",
        title: "A API do Claude e o Console",
        short: "Messages API, tokens, streaming e o playground oficial.",
        level: "avancado",
        tags: ["claude", "api", "plataforma"],
        whatIsIt:
          "Tudo na plataforma passa pela Messages API: você envia mensagens (texto, imagens, PDFs) e recebe a resposta do modelo — com streaming para respostas longas e contagem de tokens para prever custo. O Console (platform.claude.com) é a casa do desenvolvedor: chaves de API, Workbench para testar prompts, monitoramento de uso. O curso 'Building with the Claude API' cobre o espectro completo.",
        whyQA:
          "Entender a API é o que separa usar produtos prontos de construir os seus: um validador de release notes, um triador de bugs, um gerador de dados de teste plugado no pipeline. E mesmo quem não programa ganha vocabulário para conversar com quem constrói.",
        qaExample:
          "O time constrói um serviço interno: recebe a descrição de um bug, chama a Messages API com um prompt padronizado e devolve severidade sugerida + perguntas de triagem. Antes de codar, testaram e refinaram o prompt no Workbench do Console.",
        prompt:
          "Explique para um time técnico como funciona a Messages API do Claude: estrutura de uma chamada (modelo, mensagens, max_tokens), o que são tokens de entrada/saída, quando usar streaming e como estimar custo. Termine com um exemplo de caso de uso interno de qualidade.",
        resources: [
          { label: "Anthropic Academy — Building with the Claude API", url: "https://anthropic.skilljar.com/" },
          { label: "Docs — Plataforma Claude", url: "https://platform.claude.com/docs" },
        ],
      },
      {
        id: "claude-api-tool-use",
        title: "Tool use: o Claude chama as suas funções",
        short: "Ferramentas definidas por você, executadas com segurança.",
        level: "avancado",
        tags: ["claude", "api", "agente"],
        whatIsIt:
          "Com tool use, você descreve funções suas (nome, descrição, parâmetros) e o Claude decide quando chamá-las — devolvendo a chamada estruturada para o seu código executar e retornar o resultado. É o mecanismo por trás de todo agente: buscar num banco, chamar uma API interna, executar uma ação. A plataforma também oferece ferramentas do lado do servidor (busca na web, execução de código).",
        whyQA:
          "É onde a IA deixa de só responder e passa a agir dentro das suas regras: cada ferramenta é uma porta que VOCÊ define, com validação e permissão. Entender esse contrato é essencial tanto para construir quanto para testar agentes.",
        qaExample:
          "No serviço de triagem, o time expõe a ferramenta 'buscar_bugs_similares(texto)': o Claude a chama quando recebe um bug novo, o código consulta o Jira e devolve os similares, e a resposta final já diz 'possível duplicata de X'. O fluxo inteiro é testável ferramenta a ferramenta.",
        prompt:
          "Desenhe o tool use de um agente de triagem de bugs: 3 ferramentas (nome, descrição, parâmetros, o que retornam), quando o modelo deve chamar cada uma e quais validações o código executor precisa fazer antes de agir.",
        resources: [
          { label: "Docs — Tool use", url: "https://platform.claude.com/docs" },
        ],
      },
      {
        id: "claude-api-structured",
        title: "Saídas estruturadas: JSON garantido",
        short: "Respostas que seguem seu schema, sempre parseáveis.",
        level: "avancado",
        tags: ["claude", "api", "confiabilidade"],
        whatIsIt:
          "Saídas estruturadas fazem a resposta do Claude seguir um schema JSON que você define — garantindo formato válido e parseável, sem 'quase-JSON' que quebra o sistema. É o recurso que torna a integração confiável: classificações, extrações e formulários voltam no contrato exato que seu código espera.",
        whyQA:
          "Integração com IA quebra mais por formato que por conteúdo: o campo que veio faltando, a vírgula a mais. Com schema garantido, essa classe de defeito desaparece — e o teste passa a focar no que importa (a qualidade do conteúdo), não no parsing.",
        qaExample:
          "O extrator de dados de nota fiscal define o schema (número, data, valor, itens[]) e a API garante a estrutura. Os testes do time deixam de validar 'veio JSON válido?' e passam a validar 'os valores estão certos?' — com um golden set de notas reais.",
        prompt:
          "Preciso extrair dados estruturados de descrições de bugs (módulo, severidade sugerida, passos, ambiente). Desenhe o JSON schema, explique como saídas estruturadas garantem o formato e liste o que ainda preciso testar (conteúdo, não formato).",
        resources: [
          { label: "Docs — Plataforma Claude", url: "https://platform.claude.com/docs" },
        ],
      },
      {
        id: "claude-api-custo",
        title: "Caching, Batches e o custo sob controle",
        short: "As duas alavancas que cortam a conta pela metade (ou mais).",
        level: "avancado",
        tags: ["claude", "api", "custo"],
        whatIsIt:
          "Duas alavancas de custo da plataforma: prompt caching reaproveita o processamento de prefixos repetidos (aquele contexto gigante enviado toda vez passa a custar uma fração) e a Batch API processa lotes assíncronos com 50% de desconto — ideal para trabalho que não precisa de resposta imediata, como rodar um eval inteiro ou classificar milhares de itens.",
        whyQA:
          "Custo é requisito não-funcional de qualquer solução com IA: o mesmo eval que custa caro e roda devagar 'no varejo' cabe no orçamento com caching + batch. Quem domina essas alavancas viabiliza usos que pareciam caros demais.",
        qaExample:
          "O eval noturno do time (500 casos contra o assistente interno) roda via Batch API com o contexto comum em cache: metade do preço pelo lote, fração do custo pelo prefixo repetido. O relatório está pronto de manhã — e o orçamento sobrevive.",
        prompt:
          "Explique prompt caching (por que a ordem do prompt importa, o que invalida o cache) e a Batch API do Claude. Depois aplique: como eu montaria um eval de 500 casos minimizando custo com as duas alavancas?",
        resources: [
          { label: "Docs — Plataforma Claude", url: "https://platform.claude.com/docs" },
        ],
      },
      {
        id: "claude-agent-sdk",
        title: "Claude Agent SDK: o Claude Code como biblioteca",
        short: "O harness completo de agente para embutir no seu produto.",
        level: "avancado",
        tags: ["claude", "sdk", "agente"],
        whatIsIt:
          "O Claude Agent SDK empacota o 'motor' do Claude Code como biblioteca (Python/TypeScript): loop agêntico completo, ferramentas embutidas (ler/editar arquivos, bash, buscas), subagentes, hooks e permissões — pronto para embutir num produto ou automação sua. Você entrega o prompt e as opções; o SDK dirige o agente. É diferente da API pura (onde você monta o loop) e dos Managed Agents (onde a Anthropic hospeda tudo).",
        whyQA:
          "Quando o time quer 'um agente que opera em arquivos e repositórios' dentro de um produto interno, o SDK evita reconstruir do zero o que o Claude Code já resolveu — com os mesmos pontos de controle (permissões, hooks) que você aprendeu a configurar.",
        qaExample:
          "O time constrói um 'auditor de repositórios': um serviço que, via Agent SDK, clona cada repositório, verifica convenções (CLAUDE.md presente? testes rodando? lint limpo?) e abre issues com o diagnóstico. Duzentas linhas de código — o harness pesado veio pronto.",
        prompt:
          "Compare as três formas de ter um agente com Claude: API + tool use (loop meu), Agent SDK (harness do Claude Code como biblioteca) e Managed Agents (hospedado). Para cada uma: quando escolher, o que eu opero e um exemplo de caso interno.",
        resources: [
          { label: "Docs — Claude Agent SDK", url: "https://code.claude.com/docs" },
        ],
      },
      {
        id: "claude-thinking-effort",
        title: "Raciocínio adaptativo e effort",
        short: "Controlar quanto o modelo pensa: profundidade × custo × latência.",
        level: "avancado",
        tags: ["claude","api","otimizacao"],
        whatIsIt:
          "A geração atual do Claude 'pensa' de forma adaptativa: decide sozinha quando e quanto raciocinar antes de responder, conforme a dificuldade. Na plataforma, o nível de esforço (effort) é o botão que calibra essa profundidade — mais esforço para problemas difíceis (melhor resultado, mais tokens e tempo), menos para tarefas simples (rápido e barato). No app, o raciocínio estendido aparece como recurso que você ativa quando a tarefa pede.",
        whyQA:
          "É a alavanca de tuning mais importante depois da escolha de modelo: o mesmo modelo entrega perfis diferentes de qualidade/custo/latência conforme o esforço. Times que testam níveis por tipo de tarefa (em vez de usar um padrão cego) pagam menos e respondem mais rápido — sem perder qualidade onde importa.",
        qaExample:
          "No serviço interno do time, a triagem simples roda com esforço baixo (resposta em segundos) e a análise de causa-raiz com esforço alto (vale esperar). Um teste A/B com 50 casos por nível mostrou onde o esforço extra muda o resultado — e onde é só custo.",
        prompt:
          "Explique o raciocínio adaptativo dos modelos Claude e o papel do nível de esforço (effort). Depois proponha um experimento: como eu descobriria o nível ideal para 3 tarefas do meu time (triagem, geração de casos, análise profunda), medindo qualidade, tempo e custo.",
        resources: [
          { label: "Docs — Plataforma Claude", url: "https://platform.claude.com/docs" },
        ],
      },
      {
        id: "claude-workbench",
        title: "Workbench: o laboratório de prompts do Console",
        short: "Testar, melhorar e avaliar prompts antes de ir a produção.",
        level: "avancado",
        tags: ["claude","api","qualidade"],
        whatIsIt:
          "O Console da plataforma tem um laboratório completo: o Workbench para testar prompts interativamente (trocando modelo e parâmetros), ferramentas que geram e melhoram prompts a partir da descrição da tarefa, e avaliação com casos de teste — rodar o prompt contra vários exemplos lado a lado e comparar versões antes de colocar em produção.",
        whyQA:
          "É a disciplina de qualidade aplicada a prompts: em vez de editar no código e 'ver se melhorou', você itera no laboratório com casos de teste — a mesma lógica de eval que o roadmap principal ensina, embutida na ferramenta oficial. Prompt que vai para produção sem passar por aqui é prompt não testado.",
        qaExample:
          "Antes de atualizar o prompt do serviço de triagem, o time roda a versão nova no avaliador do Console contra 20 casos reais e compara com a atual, lado a lado. A v2 melhora 14 casos e piora 2 — decisão informada, com evidência, antes do deploy.",
        prompt:
          "Descreva um fluxo de trabalho de qualidade para prompts usando o Console da plataforma Claude (Workbench, melhoria de prompts e avaliação com casos de teste): do rascunho ao deploy, com critérios de aprovação em cada etapa.",
        resources: [
          { label: "Docs — Plataforma Claude", url: "https://platform.claude.com/docs" },
        ],
      },
      {
        id: "claude-admin",
        title: "Administração: workspaces, chaves e custos",
        short: "Operar a plataforma para um time inteiro, sem sustos.",
        level: "avancado",
        tags: ["claude","governanca","gestao"],
        whatIsIt:
          "Operar a plataforma para um time envolve o lado administrativo do Console: workspaces para separar projetos (cada um com suas chaves e limites), chaves de API com escopo e rotação, papéis de acesso para os membros, monitoramento de uso e custo, e limites de gasto para ninguém ser surpreendido pela fatura. É a camada de governança de quem coloca IA em produção.",
        whyQA:
          "Adoção sem administração termina em incidente: chave vazada num repositório, projeto de teste consumindo o orçamento de produção, fatura surpresa. Workspaces + limites + monitoramento transformam a plataforma em serviço gerido — e dão ao gestor a visibilidade que ele precisa.",
        qaExample:
          "O time separa três workspaces (experimentos, serviço de triagem, evals noturnos), cada um com chave própria e limite de gasto. O painel de uso mostra o custo por frente semanalmente — quando os evals encarecem, a conversa é objetiva: otimizar caching ou ajustar o lote, com números na mesa.",
        prompt:
          "Monte o desenho administrativo da plataforma Claude para um time: quantos workspaces criar e por quê, política de chaves (escopo, rotação, onde nunca colocar), papéis de acesso e um ritual mensal de revisão de uso/custo. Formato: proposta de 1 página.",
        resources: [
          { label: "Console — Plataforma Claude", url: "https://platform.claude.com/docs" },
        ],
      },
      {
        id: "claude-nuvens",
        title: "Claude na sua nuvem: Bedrock, Vertex e Foundry",
        short: "Consumir Claude pela nuvem que sua empresa já contrata.",
        level: "avancado",
        tags: ["claude","nuvem","empresa"],
        whatIsIt:
          "Além da plataforma da Anthropic, o Claude está disponível nas grandes nuvens: Amazon Bedrock, Google Cloud Vertex AI e Microsoft Foundry. Para empresas, isso significa consumir os modelos com o contrato, o faturamento, a segurança e a rede que já usam — com a ressalva de que a disponibilidade de recursos varia por plataforma (nem tudo chega a todas ao mesmo tempo). A Academy tem cursos oficiais para Bedrock e Vertex.",
        whyQA:
          "É a pergunta que sempre aparece na adoção corporativa: 'podemos usar pela nossa nuvem?'. Sim — e saber os trade-offs (paridade de recursos, modelos disponíveis, integração com IAM/billing da nuvem) evita descobrir limitações no meio do projeto.",
        qaExample:
          "A empresa é 'casa AWS': o time consome Claude via Bedrock usando as credenciais e o faturamento existentes, e valida antes quais recursos da plataforma estão disponíveis lá para o caso de uso. O curso oficial 'Claude in Amazon Bedrock' acelera o onboarding do time de engenharia.",
        prompt:
          "Compare consumir o Claude pela plataforma da Anthropic versus por Amazon Bedrock / Google Vertex AI / Microsoft Foundry: quando cada caminho faz sentido, o que verificar antes (disponibilidade de recursos, modelos, integração) e um checklist de decisão para levar à arquitetura.",
        resources: [
          { label: "Anthropic Academy — cursos Bedrock e Vertex", url: "https://anthropic.skilljar.com/" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "claude-agentes",
    level: "avancado",
    title: "MCP, agentes hospedados e uso seguro",
    subtitle: "Conectar o Claude ao mundo — e operar com responsabilidade.",
    goal: "Você entende MCP a fundo, conhece os Managed Agents e aplica as práticas de uso seguro do ecossistema.",
    topics: [
      {
        id: "claude-mcp-ecossistema",
        title: "MCP no ecossistema Claude",
        short: "O protocolo aberto que conecta o Claude a tudo.",
        level: "avancado",
        tags: ["claude", "mcp", "integracao"],
        whatIsIt:
          "O MCP (Model Context Protocol) — criado pela Anthropic e hoje padrão aberto do mercado — é como o Claude se conecta a ferramentas e dados externos: um servidor MCP expõe capacidades (Jira, GitHub, banco de dados) e qualquer cliente compatível (claude.ai, Claude Code, sua aplicação) as consome. Os cursos oficiais ensinam do básico (construir servidor e cliente em Python) aos tópicos avançados (transporte, sampling).",
        whyQA:
          "MCP é a resposta para 'como dou ao Claude acesso ao NOSSO contexto': em vez de integração artesanal por ferramenta, um protocolo único — com o mesmo servidor servindo o app, o Claude Code e os agentes. Quem domina MCP destrava as integrações que o time realmente precisa.",
        qaExample:
          "O time conecta o servidor MCP do Jira ao Claude Code: '/triagem' passa a consultar bugs reais, e o mesmo servidor alimenta o assistente interno construído na API. Uma integração, três consumidores. Os cursos 'Introduction to MCP' e 'Advanced Topics' pavimentam o caminho.",
        prompt:
          "Explique o MCP (Model Context Protocol): o problema que resolve, a arquitetura servidor/cliente e por que virou padrão aberto. Depois liste 3 servidores MCP que mais ajudariam meu time [descreva suas ferramentas] e o que cada um destravaria.",
        resources: [
          { label: "MCP — site oficial do protocolo", url: "https://modelcontextprotocol.io" },
          { label: "Anthropic Academy — cursos de MCP", url: "https://anthropic.skilljar.com/" },
        ],
      },
      {
        id: "claude-managed-agents",
        title: "Managed Agents: agentes hospedados pela Anthropic",
        short: "Você define o agente; a Anthropic roda o loop e o sandbox.",
        level: "avancado",
        tags: ["claude", "agente", "plataforma"],
        whatIsIt:
          "Managed Agents é a camada da plataforma em que a Anthropic hospeda o agente por você: você registra a configuração (modelo, instruções, ferramentas, MCP, Skills) uma vez, e cada execução vira uma sessão com container isolado onde o agente trabalha — com arquivos, repositórios, credenciais em cofres (vaults) e até agendamento recorrente. Sem código de loop, sem infraestrutura própria.",
        whyQA:
          "É o caminho mais curto para agentes de verdade em produção interna: o 'agente que roda toda noite e produz o relatório' deixa de exigir servidor, fila e manutenção. Sobram as partes que são suas: definir bem o agente, dar as credenciais certas e revisar o resultado.",
        qaExample:
          "O time registra um agente 'auditor semanal': toda sexta, uma sessão agendada monta o repositório de resultados, analisa a semana e escreve o relatório em arquivos de saída. Configuração versionada, credenciais no vault, zero infraestrutura própria — e o time só revisa o entregável.",
        prompt:
          "Explique o modelo dos Managed Agents do Claude (agente persistente → sessões com container → recursos e credenciais) e desenhe um agente hospedado útil para meu time: configuração, gatilho (manual ou agendado), recursos necessários e como revisaríamos a saída.",
        resources: [
          { label: "Docs — Managed Agents", url: "https://platform.claude.com/docs" },
        ],
      },
      {
        id: "claude-uso-seguro",
        title: "Uso seguro e responsável do ecossistema",
        short: "Dados, permissões e revisão: confiar com critério.",
        level: "avancado",
        tags: ["claude", "seguranca", "governanca"],
        whatIsIt:
          "Usar bem o ecossistema inclui saber os limites: que dados podem ir para cada superfície (app, Code, API), como funcionam permissões e aprovações em cada ferramenta, o cuidado com credenciais (cofres e variáveis, nunca em prompts), e a disciplina de revisar saídas antes de agir. A Anthropic publica pesquisa e práticas nessa direção — segurança é o centro do produto, mas a operação segura é sua.",
        whyQA:
          "Cada nova capacidade (conectores, agentes, hooks) amplia o que pode dar errado sem critério: vazamento de dado em prompt, ação automática sem revisão, credencial exposta. O time que define as regras junto com a adoção escala com confiança; o que deixa para depois, escala sustos.",
        qaExample:
          "Junto com a adoção, o time fecha o acordo: dados de cliente só anonimizados; agentes com autonomia apenas em branch isolada; credenciais sempre em cofre; toda saída que vira ação passa por revisão humana. O acordo é revisitado na retro — e conecta com os tópicos de Shadow AI e governança do roadmap principal.",
        prompt:
          "Monte a política de uso seguro do ecossistema Claude para meu time, cobrindo: classificação de dados (o que pode/não pode), permissões por ferramenta (app, Claude Code, agentes), gestão de credenciais e regras de revisão humana. Uma página, tom prático.",
        resources: [
          { label: "Anthropic — Research", url: "https://www.anthropic.com/research" },
        ],
      },
      {
        id: "claude-padroes-agentes",
        title: "Padrões de agentes segundo a Anthropic",
        short: "Workflows vs agentes — e os 5 padrões que resolvem quase tudo.",
        level: "avancado",
        tags: ["claude","agente","arquitetura"],
        whatIsIt:
          "O ensaio 'Building Effective Agents', da Anthropic, virou a bússola de arquitetura do mercado: distingue workflows (fluxos orquestrados por código, com LLM nas etapas) de agentes (o modelo dirige o próprio processo), cataloga os padrões que resolvem a maioria dos casos — encadeamento de prompts, roteamento, paralelização, orquestrador-trabalhadores e avaliador-otimizador — e prega a regra de ouro: comece simples e só adicione autonomia quando a tarefa exigir.",
        whyQA:
          "Evita os dois erros clássicos: construir um agente complexo para o que era um workflow de três passos, e engessar em código o que pedia autonomia. Com o catálogo na cabeça, o time desenha a arquitetura certa — e sabe nomear o que está construindo (e testando).",
        qaExample:
          "O 'agente' de release notes do time era, na verdade, um encadeamento: extrair mudanças → classificar → redigir. Reescrito como workflow com um avaliador-otimizador no final, ficou mais barato, mais previsível e mais fácil de testar do que a versão 'agêntica' anterior.",
        prompt:
          "Explique a distinção workflows vs agentes do ensaio 'Building Effective Agents' (Anthropic) e os padrões: prompt chaining, routing, parallelization, orchestrator-workers e evaluator-optimizer. Depois classifique: [descreva uma automação que seu time quer] — qual padrão serve e por quê?",
        resources: [
          { label: "Anthropic — Building Effective Agents", url: "https://www.anthropic.com/research/building-effective-agents" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "claude-certificacao",
    level: "especialista",
    title: "Academy, cultura e certificação",
    subtitle: "A trilha oficial de estudo, a cultura por trás do Claude e o plano do time.",
    goal: "Você conhece o catálogo da Anthropic Academy, montou sua trilha de estudo e o time tem um plano rumo à certificação.",
    topics: [
      {
        id: "claude-academy",
        title: "Anthropic Academy: o mapa dos cursos oficiais",
        short: "O catálogo gratuito, do Claude 101 ao MCP avançado.",
        level: "especialista",
        tags: ["claude", "aprendizado", "carreira"],
        whatIsIt:
          "A Anthropic Academy (anthropic.skilljar.com) concentra os cursos oficiais e gratuitos: fundamentos (Claude 101, Claude Code 101, Claude Platform 101), aprofundamentos (Claude Code in Action, Building with the Claude API), especializações (Introduction to MCP e Advanced Topics, Introduction to Subagents, Introduction to Agent Skills, Introduction to Claude Cowork) e a família AI Fluency (colaboração eficaz e ética com IA). Há ainda tutoriais interativos no GitHub (prompting, evals, tool use) e o Cookbook com código pronto.",
        whyQA:
          "É a fonte primária de estudo — o material do próprio fabricante, atualizado e gratuito. Para o time, o catálogo permite trilhas por perfil: todos passam pelos fundamentos; quem constrói vai de API/MCP; quem lidera adota AI Fluency. Este roadmap te dá o mapa; a Academy, a profundidade.",
        qaExample:
          "O time monta o ciclo de estudo: mês 1, Claude 101 + Claude Code 101 para todos; mês 2, Claude Code in Action para o time técnico e AI Fluency para liderança; mês 3, MCP para quem vai construir integrações. Cada curso concluído é registrado — material pronto para a meta de certificação.",
        prompt:
          "Com base no catálogo da Anthropic Academy (Claude 101, Claude Code 101/in Action, Platform 101, Building with the API, cursos de MCP, Subagents, Agent Skills, Cowork e AI Fluency), monte uma trilha de estudo de 3 meses para um time de [descreva os perfis], com carga leve semanal e critérios de conclusão.",
        resources: [
          { label: "Anthropic Academy — catálogo completo", url: "https://anthropic.skilljar.com/" },
          { label: "Anthropic — Learn: Build with Claude", url: "https://www.anthropic.com/learn/build-with-claude" },
        ],
      },
      {
        id: "claude-certificacao-plano",
        title: "Rumo à certificação: o plano do time",
        short: "Transformar estudo em competência comprovável.",
        level: "especialista",
        tags: ["claude", "carreira", "lideranca"],
        whatIsIt:
          "A preparação séria vale antes mesmo de uma certificação formal: concluir a trilha da Academy, acumular evidências práticas (Skills criadas, agentes construídos, integrações MCP, automações no Claude Code) e validar a competência internamente — este próprio roadmap, com seus quizzes e progresso, funciona como trilho de preparação. Quando a certificação oficial existir, o time que estudou assim estará pronto no dia 1.",
        whyQA:
          "Competência comprovável muda conversas: com o gestor (evolução do time mensurável), com a empresa (quem chamar para projetos de IA) e com a carreira de cada um. E o processo de se preparar — estudar, praticar, ser avaliado — já entrega o valor principal: um time que domina a ferramenta de fato.",
        qaExample:
          "O time define o 'selo interno Claude': concluir esta trilha do roadmap (26 tópicos + quizzes), certificados dos cursos da Academy e uma entrega prática (uma Skill, um comando de time ou uma integração MCP em uso real). O gestor acompanha pelo relatório — e o selo vira critério para puxar as iniciativas de IA.",
        prompt:
          "Desenhe um programa interno de 'certificação Claude' para meu time: níveis (fundamentos / praticante / especialista), critérios objetivos de cada nível (cursos, prática, avaliação), evidências aceitas e como reconhecer quem conclui. Formato: proposta de 1 página para o gestor.",
        resources: [
          { label: "Anthropic Academy — catálogo completo", url: "https://anthropic.skilljar.com/" },
        ],
      },
      {
        id: "claude-interpretabilidade",
        title: "Por dentro do 'cérebro' do Claude",
        short: "O que a pesquisa de interpretabilidade já enxerga no modelo.",
        level: "especialista",
        tags: ["claude","pesquisa","cultura"],
        whatIsIt:
          "Interpretabilidade é a frente de pesquisa da Anthropic que abre a caixa do modelo: mapear os 'conceitos' (features) que se ativam dentro do Claude, entender os circuitos que ligam entrada a resposta e usar isso para segurança — detectar comportamentos indesejados e entender por que o modelo respondeu como respondeu. É pesquisa de fronteira, publicada abertamente em anthropic.com/research.",
        whyQA:
          "Não é conhecimento de uso diário — é cultura profunda: entender que o modelo tem representações internas estudáveis muda a conversa sobre confiança ('não é magia nem caixa-preta absoluta') e prepara o time para o futuro próximo, em que ferramentas de interpretabilidade viram parte do arsenal de qualidade de IA.",
        qaExample:
          "Na discussão sobre confiar num agente para uma tarefa crítica, alguém pergunta 'mas o que acontece lá dentro?'. Quem estudou este tópico eleva o nível: explica o que a pesquisa já consegue observar, o que ainda não, e por que isso importa para o risco que o time está avaliando.",
        prompt:
          "Explique em linguagem acessível o que é a pesquisa de interpretabilidade da Anthropic: o que são as 'features' mapeadas dentro do Claude, o que já é possível observar e por que isso importa para segurança e confiança em IA. Termine com 3 implicações práticas para times que usam IA.",
        resources: [
          { label: "Anthropic — Research (Interpretability)", url: "https://www.anthropic.com/research" },
        ],
      },
    ],
  },
];

export const CLAUDE_TOPICS: Topic[] = CLAUDE_ROADMAP.flatMap((s) => s.topics);
export const TOTAL_CLAUDE_TOPICS = CLAUDE_TOPICS.length;
export const CLAUDE_TOPIC_IDS: ReadonlySet<string> = new Set(
  CLAUDE_TOPICS.map((t) => t.id),
);

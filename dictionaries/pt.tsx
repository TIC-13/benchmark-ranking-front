export default {
  header: {
    links: {
      visionRanking: "Ranking de visão",
      llmRanking: "Ranking de LLMs",
      about: "Sobre"
    }
  },
  darkModeToggle: {
    system: "Sistema",
    light: "Claro",
    dark: "Escuro"
  },
  languageToggle: {
    english: "Inglês",
    portuguese: "Português"
  },
  tableControls: {
    previous: "Anterior",
    next: "Próximo"
  },
  generalWarnings: {
    atLeastOneSelected: "Pelo menos um valor deve ser selecionado"
  },
  actions: {
    runningOn: "Executando na"
  },
  visionRanking: {
    title: "Ranking de modelos de visão",
    appCard: {
      title: "Speed.AI - AI Benchmarking",
      description: "App usado para classificar os smartphones. Disponível na PlayStore e no GitHub."
    },
    description: "Esse ranking classifica smartphones Android pelos valores coletados no aplicativo Speed.AI, que faz benchmarking de modelos de inteligência artificial nativamente em aparelhos Android.",
    help: {
      label: "Ajuda",
      content: [
        {
          value: "result",
          label: "Como os valores do ranking são calculados?",
          content: "Os valores do ranking são representados em milissegundos, sendo obtidos por meio de uma média ponderada que leva em conta o número de imagens usados para a execução de cada teste. Apenas inferências que cumprem os critérios representados no filtro são consideradas."
        },
        {
          value: "gpu",
          label: "Por que o consumo de GPU não está aparecendo?",
          content: "Alguns modelos de celulares não possibilitam a coleta da estatística do uso da GPU, por esse motivo alguns valores dessa medida podem estar ausentes."
        }
      ]
    },
    filters: {
      title: "Configurações do ranking",
      subtitle: "Selecione modelos e quantizações que serão usados para calcular os resultados",
      categories: {
        speed: "Tempo de inferência (ms)",
        cpu: "Uso de CPU (%)",
        gpu: "Uso de GPU (%)",
        ram: "Uso de RAM (MB)"
      },
      models: {
        label: "Modelos",
        types: {
          classification: "Classificação",
          detection: "Detecção",
          segmentation: "Segmentação",
          language: "Linguagem",
          other: "Outros"
        }
      },
      quantizations: "Quantizações",
      toggles: {
        inferenceNumber: "Mostrar número de inferências",
        showPowerAndEnergy: "Mostrar potência e energia consumida",
        orderByPowerAndEnergy: "Ordenar por potência e energia",
        removeAll: "Remover todos",
        selectAll: "Selecionar todos"
      },
      buttons: {
        apply: "Aplicar filtro"
      },
      warnings: {
        changesNotSaved: "Mudanças não salvas"
      }
    },
    alert: {
      label: "Alerta",
      notSupported: "Modelos não suportados"
    },
    table: {
      inference: {
        singular: "inferência",
        plural: "inferências"
      },
      unavailable: {
        inferencesNumber: "Inferências não calculadas",
        powerAndEnergy: "Consumo não calculado"
      }
    }
  },
  llmRanking: {
    title: "Ranking de LLMs",
    description: "Esse ranking classifica smartphones Android pelos valores coletados no aplicativo Speed.AI LLM Version, que faz benchmarking de LLMs (Large Language Models, como Llama e Gemma) em aparelhos Android, usando a plataforma MLC LLM para a execução dos modelos.",
    appCard: {
      title: "Speed.AI - LLM Version",
      description: "App usado para classificar os smartphones. Disponível na PlayStore e no GitHub."
    },
    filters: {
      title: "Configurações do ranking",
      subtitle: "Selecione modelos e quantizações que serão usados para calcular os resultados",
      mode: {
        prefill: "Prefill (segundos)",
        decode: "Decode (tok/s)",
        cpu: "Uso de CPU (%)",
        gpu: "Uso de GPU (%)",
        ram: "Uso de RAM (MB)"
      },
      toggles: {
        conversationNumber: "Mostrar número de conversas do dispositivo",
        showPowerAndEnergy: "Mostrar potência e energia consumida",
        orderByPowerAndEnergy: "Ordenar por potência e energia"
      },
      models: {
        label: "Modelos"
      }
    },
    help: {
      label: "Ajuda",
      content: [
        {
          value: "prefill",
          label: "O que é prefill?",
          content: "Tempo necessário para o LLM processar a input do usuário e começar a gerar uma resposta"
        },
        {
          value: "decode",
          label: "O que é decode?",
          content: "Decode tok/s mede quantos tokens o modelo pode gerar por segundo durante a fase de decodificação."
        },
        {
          value: "conversation",
          label: "O que é uma conversa?",
          content: "Uma conversa é a etapa principal na avaliação de desempenho, durante a qual um conjunto predefinido de perguntas é feito ao modelo LLM. Durante esse processo, medimos os dados usados para construir a classificação."
        },
        {
          value: "result",
          label: "Como os tokens por segundo são calculados?",
          content: "Os tokens por segundo são calculados por meio de uma média simples de todas as conversas."
        },
        {
          value: "gpu",
          label: "Por que não apresentamos o consumo de CPU ou GPU?",
          content: "Atualmente a plataforma Android não possibilita a coleta da estatística do uso da CPU por aplicativos. Enquanto que a GPU não é utilizada pois o framework de execução de LLMs utiliza CPU."
        }
      ]
    },
    phoneAlert: "É possivel que os nomes dos smartphones no ranking não sejam seus nomes comerciais",
    table: {
      columns: {
        result: {
          header: "Resultado"
        }
      },
      conversation: {
        singular: "conversa",
        plural: "conversas"
      },
      unavailable: {
        conversatiosnNumber: "Nº de conversas não calculado",
        powerAndEnergy: "Consumo não calculado"
      }
    }
  },
  about: {
    aboutLuxAI: {
      title: "Sobre a LuxAI",
      content: <>
        <p>
          O{" "}
          <a
            href="https://luxai.cin.ufpe.br"
            className="text-blue-500 underline"
          >
            LuxAI
          </a>{" "}
          é integrante do PPI (PROGRAMAS E PROJETOS PRIORITÁRIOS DA LEI DE TICs) no Centro de Informática da UFPE que utiliza recursos disponibilizados pelo Ministério da Ciência, Tecnologia, Inovações e Comunicações, obtidos através da Lei da Informática (Lei nº 8.248/91), através do Programa SOFTEX.
        </p>
        <br />
        <p>
          As principais áreas de estudo e desenvolvimento do LuxAI são: Fotografia Computacional, Inteligência Artifical, Análise de Qualidade de Imagem e Análise de Performance de Sistemas Heterogêneos.
        </p>
        <br />
        <p>
          Trabalhamos no desenvolvimento de aplicações móveis com funcionalidades baseadas em IA, além de treinamento, fine tuning, pruning e outras técnicas de performance em IA.
        </p>
        <br />
        <p>
          Oferecemos serviços personalizados à ampla indústria, desde treinamentos em Fotografia Computacional e Inteligência Artificial, Análise de desempenho de modelos em dispositivos móveis, treinamento e fine tuning de modelos. Além disso, dispomos de consultoria no desenvolvimento de aplicações de IA, abarcando desde os modelos mais adequados e criação de datasets até técnicas de melhoria do desempenho de execução de modelos em hardwares restritivos.
        </p>
        <br />
        <p>
          <strong>
            Sinta-se convidado para visitar nosso site:{" "}
          </strong>
          <a
            href="https://luxai.cin.ufpe.br"
            className="text-blue-500 underline"
          >
            https://luxai.cin.ufpe.br
          </a>
        </p>
      </>
    }
  }
};
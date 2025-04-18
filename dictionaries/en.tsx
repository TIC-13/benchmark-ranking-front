export default {
  header: {
    links: {
      visionRanking: "Vision Ranking",
      llmRanking: "LLM Ranking",
      about: "About"
    }
  },
  darkModeToggle: {
    system: "System",
    light: "Light",
    dark: "Dark"
  },
  languageToggle: {
    english: "English",
    portuguese: "Portuguese"
  },
  tableControls: {
    previous: "Previous",
    next: "Next"
  },
  generalWarnings: {
    atLeastOneSelected: "At least one value should be selected"
  },
  actions: {
    runningOn: "Running on"
  },
  visionRanking: {
    title: "Vision Model Ranking",
    description: "This ranking classifies Android smartphones based on the data collected by the Speed.AI app, which benchmarks AI models natively on Android devices.",
    appCard: {
      title: "Speed.AI - AI Benchmarking",
      description: "App used to rank the smartphones. Available on the PlayStore and GitHub."
    },
    help: {
      label: "Help",
      content: [
        {
          value: "result",
          label: "How are the ranking values calculated?",
          content: "The ranking values are represented in milliseconds and are obtained through a weighted average that takes into account the number of images used for each test execution. Only inferences that meet the criteria represented in the filter are considered."
        },
        {
          value: "gpu",
          label: "Why is GPU usage not appearing?",
          content: "Some smartphone models do not allow the collection of GPU usage statistics, which is why some values for this measure may be missing."
        }
      ]
    },
    filters: {
      title: "Ranking settings",
      subtitle: "Select models and quantizations to be used for calculating the results",
      categories: {
        speed: "Inference time (ms)",
        cpu: "CPU Usage (%)",
        gpu: "GPU Usage (%)",
        ram: "RAM Usage (MB)"
      },
      models: {
        label: "Models",
        types: {
          classification: "Classification",
          detection: "Detection",
          segmentation: "Segmentation",
          language: "Language",
          other: "Other"
        }
      },
      quantizations: "Quantizations",
      toggles: {
        inferenceNumber: "Show number of inferences",
        showPowerAndEnergy: "Show power and energy consumed",
        orderByPowerAndEnergy: "Order by power and energy",
        removeAll: "Remove all",
        selectAll: "Select all"
      },
      buttons: {
        apply: "Apply filter"
      },
      warnings: {
        changesNotSaved: "Changes not saved"
      }
    },
    alert: {
      label: "Alert",
      notSupported: "Models not supported"
    },
    table: {
      inference: {
        singular: "inference",
        plural: "inferences"
      },
      unavailable: {
        inferencesNumber: "Inferences not calculated",
        powerAndEnergy: "Consumption not calculated"
      }
    }
  },
  llmRanking: {
    title: "LLM Ranking",
    description: "This ranking classifies Android smartphones based on data collected by the Speed.AI LLM Version app, which benchmarks LLMs (Large Language Models, such as Llama and Gemma) on Android devices, using the MLC LLM platform to run the models.",
    appCard: {
      title: "Speed.AI - LLM Version",
      description: "App used to rank the smartphones. Available on the PlayStore and GitHub."
    },
    filters: {
      title: "Ranking settings",
      subtitle: "Select models and quantizations to be used for calculating the results",
      mode: {
        prefill: "Prefill (seconds)",
        decode: "Decode (tok/s)",
        cpu: "CPU Usage (%)",
        gpu: "GPU Usage (%)",
        ram: "RAM Usage (MB)"
      },
      toggles: {
        conversationNumber: "Show the number of the device's conversations",
        showPowerAndEnergy: "Show power and energy consumed",
        orderByPowerAndEnergy: "Order by power and energy"
      },
      models: {
        label: "Models"
      }
    },
    help: {
      label: "Help",
      content: [
        {
          value: "prefill",
          label: "What is prefill?",
          content: "Time required for the LLM to process the user's input and start generating a response."
        },
        {
          value: "decode",
          label: "What is decode?",
          content: "Decode tok/s measures how many tokens the model can generate per second during the decoding phase."
        },
        {
          value: "conversation",
          label: "What is a conversation?",
          content: "A conversation is the primary step in benchmarking, during which a predetermined set of questions is posed to the LLM model. Throughout this process, we measure the data used to construct the ranking."
        },
        {
          value: "result",
          label: "How are tokens per second calculated?",
          content: "Tokens per second are calculated using a simple average of all conversations."
        },
        {
          value: "gpu",
          label: "Why don't we display CPU or GPU consumption?",
          content: "Currently, the Android platform does not allow the collection of CPU usage statistics by applications. Meanwhile, the GPU is not used because the LLM execution framework relies on the CPU."
        }
      ]
    },
    phoneAlert: "It is possible that the smartphone names in the ranking are not their commercial names",
    table: {
      columns: {
        result: {
          header: "Result"
        }
      },
      conversation: {
        singular: "conversation",
        plural: "conversations"
      },
      unavailable: {
        conversatiosnNumber: "Number of conversations not calculated",
        powerAndEnergy: "Consumption not calculated"
      }
    }
  },
  about: {
    aboutLuxAI: {
      title: "About LuxAI",
      content: <>
      <p>
        <a
          href="https://luxai.cin.ufpe.br"
          className="text-blue-500 underline"
        >
          LuxAI
        </a>{" "}
        is part of the PPI (Priority Programs and Projects of the TICs Law) at the Center for Informatics of UFPE, utilizing resources provided by the Ministry of Science, Technology, Innovations, and Communications of Brazil, obtained through the Informatics Law (Law No. 8.248/91), via the SOFTEX Program.
      </p>
      <br />
      <p>
        The main areas of study and development at LuxAI are: Computational Photography, Artificial Intelligence, Image Quality Analysis, and Performance Analysis of Heterogeneous Systems.
      </p>
      <br />
      <p>
        We work on the development of mobile applications with AI-based functionalities, as well as training, fine-tuning, pruning, and other AI performance techniques.
      </p>
      <br />
      <p>
        We offer customized services to a wide range of industries, including training in Computational Photography and Artificial Intelligence, performance analysis of models on mobile devices, and model training and fine-tuning. Additionally, we provide consultancy in the development of AI applications, covering everything from selecting the most suitable models and creating datasets to techniques for improving model execution performance on restrictive hardware.
      </p>
      <br />
      <p>
        <strong>
          Feel invited to visit our website:{" "}
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
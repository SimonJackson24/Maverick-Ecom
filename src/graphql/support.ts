import { gql } from '@apollo/client';

export const GET_SUPPORT_TICKETS = gql`
  query GetSupportTickets($filter: TicketFilterInput) {
    supportTickets(filter: $filter) {
      id
      customerId
      customerName
      customerEmail
      subject
      description
      status
      priority
      category
      assignedTo
      createdAt
      updatedAt
      lastResponseAt
      tags
      relatedOrderId
      responses {
        id
        content
        authorId
        authorName
        authorType
        createdAt
        isInternal
        attachments {
          id
          filename
          fileType
          fileSize
          url
          uploadedAt
        }
      }
    }
  }
`;

export const GET_TICKET_BY_ID = gql`
  query GetTicketById($id: ID!) {
    supportTicket(id: $id) {
      id
      customerId
      customerName
      customerEmail
      subject
      description
      status
      priority
      category
      assignedTo
      createdAt
      updatedAt
      lastResponseAt
      tags
      relatedOrderId
      responses {
        id
        content
        authorId
        authorName
        authorType
        createdAt
        isInternal
        attachments {
          id
          filename
          fileType
          fileSize
          url
          uploadedAt
        }
      }
    }
  }
`;

export const CREATE_SUPPORT_TICKET = gql`
  mutation CreateSupportTicket($input: CreateTicketInput!) {
    createSupportTicket(input: $input) {
      id
      customerId
      customerName
      subject
      status
      priority
    }
  }
`;

export const UPDATE_TICKET = gql`
  mutation UpdateTicket($id: ID!, $input: UpdateTicketInput!) {
    updateSupportTicket(id: $id, input: $input) {
      id
      status
      priority
      assignedTo
      updatedAt
    }
  }
`;

export const ADD_TICKET_RESPONSE = gql`
  mutation AddTicketResponse($input: AddResponseInput!) {
    addTicketResponse(input: $input) {
      id
      content
      authorId
      authorName
      authorType
      createdAt
      isInternal
      attachments {
        id
        filename
        url
      }
    }
  }
`;

export const GET_CHAT_SESSIONS = gql`
  query GetChatSessions($filter: ChatSessionFilterInput) {
    chatSessions(filter: $filter) {
      id
      customerId
      customerName
      customerEmail
      status
      startedAt
      endedAt
      assignedTo
      tags
      messages {
        id
        content
        senderId
        senderType
        senderName
        timestamp
        status
        attachments {
          id
          filename
          url
        }
      }
    }
  }
`;

export const CREATE_CHAT_SESSION = gql`
  mutation CreateChatSession($input: CreateChatSessionInput!) {
    createChatSession(input: $input) {
      id
      customerId
      customerName
      status
      startedAt
    }
  }
`;

export const SEND_CHAT_MESSAGE = gql`
  mutation SendChatMessage($input: SendMessageInput!) {
    sendChatMessage(input: $input) {
      id
      content
      senderId
      senderType
      senderName
      timestamp
      status
    }
  }
`;

export const GET_SUPPORT_METRICS = gql`
  query GetSupportMetrics($timeframe: String!) {
    supportMetrics(timeframe: $timeframe) {
      tickets {
        total
        open
        inProgress
        resolved
        closed
        averageResponseTime
        averageResolutionTime
      }
      chat {
        activeChats
        totalChatsToday
        averageWaitTime
        averageChatDuration
        satisfactionRate
      }
      performance {
        ticketsResolvedToday
        chatsHandledToday
        averageSatisfactionScore
        responseTimePercentiles {
          p50
          p90
          p99
        }
      }
    }
  }
`;

export const GET_KNOWLEDGE_BASE_ARTICLES = gql`
  query GetKnowledgeBaseArticles($filter: ArticleFilterInput) {
    knowledgeBaseArticles(filter: $filter) {
      id
      title
      content
      category
      tags
      author
      createdAt
      updatedAt
      publishedAt
      status
      viewCount
      helpfulVotes
      unhelpfulVotes
    }
  }
`;

export const CREATE_KNOWLEDGE_BASE_ARTICLE = gql`
  mutation CreateKnowledgeBaseArticle($input: CreateArticleInput!) {
    createKnowledgeBaseArticle(input: $input) {
      id
      title
      status
    }
  }
`;

export const UPDATE_KNOWLEDGE_BASE_ARTICLE = gql`
  mutation UpdateKnowledgeBaseArticle($id: ID!, $input: UpdateArticleInput!) {
    updateKnowledgeBaseArticle(id: $id, input: $input) {
      id
      title
      status
      updatedAt
    }
  }
`;

export const GET_SUPPORT_SETTINGS = gql`
  query GetSupportSettings {
    supportSettings {
      ticketing {
        categories
        priorities {
          name
          color
          slaMinutes
        }
        autoAssignment
        requireResponse
        defaultResponseTemplates {
          name
          content
          category
        }
      }
      chat {
        enabled
        operatingHours {
          day
          start
          end
          isOpen
        }
        maxConcurrentChats
        awayMessage
        welcomeMessage
        offlineMessage
        fileUpload {
          enabled
          maxSize
          allowedTypes
        }
      }
      notifications {
        email {
          enabled
          newTicketTemplate
          ticketUpdateTemplate
          ticketResolutionTemplate
        }
        slack {
          enabled
          webhook
          channels {
            newTickets
            highPriority
            resolved
          }
        }
      }
      automation {
        enabled
        rules {
          name
          conditions {
            field
            operator
            value
          }
          actions {
            type
            params
          }
        }
      }
    }
  }
`;

export const UPDATE_SUPPORT_SETTINGS = gql`
  mutation UpdateSupportSettings($input: UpdateSupportSettingsInput!) {
    updateSupportSettings(input: $input) {
      ticketing {
        categories
        autoAssignment
        requireResponse
      }
      chat {
        enabled
        maxConcurrentChats
      }
      notifications {
        email {
          enabled
        }
        slack {
          enabled
        }
      }
      automation {
        enabled
      }
    }
  }
`;

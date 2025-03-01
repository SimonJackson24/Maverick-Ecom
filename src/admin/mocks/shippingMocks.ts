import { graphql, HttpResponse } from 'msw';

const shippingSettings = {
  royalMail: {
    enabled: true,
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    environment: 'test',
    defaultService: 'secondClass',
    autoGenerateLabels: true,
    autoCreateManifest: true,
    defaultPackageTypes: {
      letter: {
        name: 'Letter',
        length: 24,
        width: 16.5,
        height: 0.5,
        weight: 0.1,
        maxWeight: 0.1,
        description: 'For letters up to 100g',
        restrictions: 'Must be flat and contain only paper',
      },
      largeLetter: {
        name: 'Large Letter',
        length: 35.3,
        width: 25,
        height: 2.5,
        weight: 0.25,
        maxWeight: 0.75,
        description: 'For larger letters and documents up to 750g',
        restrictions: 'Must be flat and rectangular',
      },
      smallParcel: {
        name: 'Small Parcel',
        length: 45,
        width: 35,
        height: 16,
        weight: 2,
        maxWeight: 2,
        description: 'For small items up to 2kg',
        restrictions: 'Maximum combined length and height no more than 90cm',
      },
      mediumParcel: {
        name: 'Medium Parcel',
        length: 61,
        width: 46,
        height: 46,
        weight: 20,
        maxWeight: 20,
        description: 'For medium-sized items up to 20kg',
        restrictions: 'Maximum combined length and height no more than 150cm',
      },
    },
    services: {
      firstClass: {
        letter: {
          price: 1.35,
          deliveryAim: '1 working day',
          compensation: 20,
        },
        largeLetter: {
          price: 2.35,
          deliveryAim: '1 working day',
          compensation: 20,
        },
        smallParcel: {
          price: 4.19,
          deliveryAim: '1 working day',
          compensation: 20,
        },
        mediumParcel: {
          price: 6.29,
          deliveryAim: '1 working day',
          compensation: 20,
        },
      },
      secondClass: {
        letter: {
          price: 0.85,
          deliveryAim: '2-3 working days',
          compensation: 20,
        },
        largeLetter: {
          price: 1.95,
          deliveryAim: '2-3 working days',
          compensation: 20,
        },
        smallParcel: {
          price: 3.49,
          deliveryAim: '2-3 working days',
          compensation: 20,
        },
        mediumParcel: {
          price: 5.79,
          deliveryAim: '2-3 working days',
          compensation: 20,
        },
      },
      signedFor: {
        firstClass: {
          letter: {
            price: 3.15,
            deliveryAim: '1 working day',
            features: ['Signature on delivery', 'Online tracking', 'Compensation up to £50'],
          },
          largeLetter: {
            price: 4.15,
            deliveryAim: '1 working day',
            features: ['Signature on delivery', 'Online tracking', 'Compensation up to £50'],
          },
          smallParcel: {
            price: 5.99,
            deliveryAim: '1 working day',
            features: ['Signature on delivery', 'Online tracking', 'Compensation up to £50'],
          },
          mediumParcel: {
            price: 8.09,
            deliveryAim: '1 working day',
            features: ['Signature on delivery', 'Online tracking', 'Compensation up to £50'],
          },
        },
        secondClass: {
          letter: {
            price: 2.65,
            deliveryAim: '2-3 working days',
            features: ['Signature on delivery', 'Online tracking', 'Compensation up to £50'],
          },
          largeLetter: {
            price: 3.75,
            deliveryAim: '2-3 working days',
            features: ['Signature on delivery', 'Online tracking', 'Compensation up to £50'],
          },
          smallParcel: {
            price: 5.29,
            deliveryAim: '2-3 working days',
            features: ['Signature on delivery', 'Online tracking', 'Compensation up to £50'],
          },
          mediumParcel: {
            price: 7.59,
            deliveryAim: '2-3 working days',
            features: ['Signature on delivery', 'Online tracking', 'Compensation up to £50'],
          },
        },
      },
      tracked24: {
        smallParcel: {
          price: 6.45,
          deliveryAim: 'Next working day',
          features: [
            'End-to-end tracking',
            'SMS/Email notifications',
            'Signature on delivery',
            'Compensation up to £100',
          ],
        },
        mediumParcel: {
          price: 9.95,
          deliveryAim: 'Next working day',
          features: [
            'End-to-end tracking',
            'SMS/Email notifications',
            'Signature on delivery',
            'Compensation up to £100',
          ],
        },
      },
      tracked48: {
        smallParcel: {
          price: 5.65,
          deliveryAim: '2-3 working days',
          features: [
            'End-to-end tracking',
            'SMS/Email notifications',
            'Signature on delivery',
            'Compensation up to £100',
          ],
        },
        mediumParcel: {
          price: 8.95,
          deliveryAim: '2-3 working days',
          features: [
            'End-to-end tracking',
            'SMS/Email notifications',
            'Signature on delivery',
            'Compensation up to £100',
          ],
        },
      },
      specialDelivery1pm: {
        smallParcel: {
          price: 7.65,
          deliveryAim: 'Next working day by 1pm',
          features: [
            'Guaranteed next day delivery by 1pm',
            'End-to-end tracking',
            'SMS/Email notifications',
            'Signature on delivery',
            'Enhanced compensation up to £500',
            'Free redelivery',
          ],
        },
        mediumParcel: {
          price: 10.95,
          deliveryAim: 'Next working day by 1pm',
          features: [
            'Guaranteed next day delivery by 1pm',
            'End-to-end tracking',
            'SMS/Email notifications',
            'Signature on delivery',
            'Enhanced compensation up to £500',
            'Free redelivery',
          ],
        },
      },
      specialDelivery9am: {
        smallParcel: {
          price: 23.50,
          deliveryAim: 'Next working day by 9am',
          features: [
            'Guaranteed next day delivery by 9am',
            'End-to-end tracking',
            'SMS/Email notifications',
            'Signature on delivery',
            'Enhanced compensation up to £750',
            'Free redelivery',
          ],
        },
        mediumParcel: {
          price: 26.80,
          deliveryAim: 'Next working day by 9am',
          features: [
            'Guaranteed next day delivery by 9am',
            'End-to-end tracking',
            'SMS/Email notifications',
            'Signature on delivery',
            'Enhanced compensation up to £750',
            'Free redelivery',
          ],
        },
      },
    },
    internationalServices: {
      internationalStandard: {
        europeanZone: {
          letter: {
            price: 2.20,
            deliveryAim: '3-5 working days',
            compensation: 20,
          },
          largeLetter: {
            price: 3.90,
            deliveryAim: '3-5 working days',
            compensation: 20,
          },
          smallParcel: {
            price: 10.55,
            deliveryAim: '3-5 working days',
            compensation: 20,
          },
          mediumParcel: {
            price: 17.95,
            deliveryAim: '3-5 working days',
            compensation: 20,
          },
        },
        worldZone1: {
          letter: {
            price: 2.40,
            deliveryAim: '6-7 working days',
            compensation: 20,
          },
          largeLetter: {
            price: 4.30,
            deliveryAim: '6-7 working days',
            compensation: 20,
          },
          smallParcel: {
            price: 14.95,
            deliveryAim: '6-7 working days',
            compensation: 20,
          },
          mediumParcel: {
            price: 24.95,
            deliveryAim: '6-7 working days',
            compensation: 20,
          },
        },
        worldZone2: {
          letter: {
            price: 2.40,
            deliveryAim: '6-7 working days',
            compensation: 20,
          },
          largeLetter: {
            price: 4.30,
            deliveryAim: '6-7 working days',
            compensation: 20,
          },
          smallParcel: {
            price: 16.95,
            deliveryAim: '6-7 working days',
            compensation: 20,
          },
          mediumParcel: {
            price: 28.95,
            deliveryAim: '6-7 working days',
            compensation: 20,
          },
        },
      },
      internationalTracked: {
        europeanZone: {
          smallParcel: {
            price: 13.95,
            deliveryAim: '3-5 working days',
            features: [
              'End-to-end tracking',
              'Signature on delivery',
              'Online confirmation of delivery',
              'Compensation up to £100',
            ],
          },
          mediumParcel: {
            price: 21.95,
            deliveryAim: '3-5 working days',
            features: [
              'End-to-end tracking',
              'Signature on delivery',
              'Online confirmation of delivery',
              'Compensation up to £100',
            ],
          },
        },
        worldZone1: {
          smallParcel: {
            price: 18.95,
            deliveryAim: '5-7 working days',
            features: [
              'End-to-end tracking',
              'Signature on delivery',
              'Online confirmation of delivery',
              'Compensation up to £100',
            ],
          },
          mediumParcel: {
            price: 29.95,
            deliveryAim: '5-7 working days',
            features: [
              'End-to-end tracking',
              'Signature on delivery',
              'Online confirmation of delivery',
              'Compensation up to £100',
            ],
          },
        },
        worldZone2: {
          smallParcel: {
            price: 20.95,
            deliveryAim: '6-8 working days',
            features: [
              'End-to-end tracking',
              'Signature on delivery',
              'Online confirmation of delivery',
              'Compensation up to £100',
            ],
          },
          mediumParcel: {
            price: 33.95,
            deliveryAim: '6-8 working days',
            features: [
              'End-to-end tracking',
              'Signature on delivery',
              'Online confirmation of delivery',
              'Compensation up to £100',
            ],
          },
        },
      },
      internationalSignedFor: {
        europeanZone: {
          letter: {
            price: 7.20,
            deliveryAim: '3-5 working days',
            features: ['Signature on delivery', 'Online confirmation of delivery'],
          },
          largeLetter: {
            price: 8.90,
            deliveryAim: '3-5 working days',
            features: ['Signature on delivery', 'Online confirmation of delivery'],
          },
          smallParcel: {
            price: 15.55,
            deliveryAim: '3-5 working days',
            features: ['Signature on delivery', 'Online confirmation of delivery'],
          },
          mediumParcel: {
            price: 22.95,
            deliveryAim: '3-5 working days',
            features: ['Signature on delivery', 'Online confirmation of delivery'],
          },
        },
      },
    },
    zones: {
      europeanZone: [
        'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 
        'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
      ],
      worldZone1: [
        'US', 'CA', 'AU', 'NZ', 'JP', 'KR', 'SG', 'HK'
      ],
      worldZone2: [
        'Rest of World'
      ],
    },
  },
  zones: [
    {
      id: '1',
      name: 'UK Mainland',
      countries: ['GB'],
      regions: ['England', 'Wales', 'Scotland'],
      postcodes: [],
      methods: [
        {
          id: '1',
          name: 'Royal Mail 2nd Class',
          carrier: 'Royal Mail',
          service: 'secondClass',
          cost: 3.49,
          conditions: [
            {
              type: 'weight',
              value: 2,
              operator: 'lte',
            },
          ],
        },
        {
          id: '2',
          name: 'Royal Mail 1st Class',
          carrier: 'Royal Mail',
          service: 'firstClass',
          cost: 4.19,
          conditions: [
            {
              type: 'weight',
              value: 2,
              operator: 'lte',
            },
          ],
        },
        {
          id: '3',
          name: 'Royal Mail Tracked 24',
          carrier: 'Royal Mail',
          service: 'tracked24',
          cost: 6.45,
          conditions: [
            {
              type: 'weight',
              value: 2,
              operator: 'lte',
            },
          ],
        },
      ],
    },
    {
      id: '2',
      name: 'Northern Ireland',
      countries: ['GB'],
      regions: ['Northern Ireland'],
      postcodes: [],
      methods: [
        {
          id: '4',
          name: 'Royal Mail 2nd Class',
          carrier: 'Royal Mail',
          service: 'secondClass',
          cost: 3.49,
          conditions: [
            {
              type: 'weight',
              value: 2,
              operator: 'lte',
            },
          ],
        },
        {
          id: '5',
          name: 'Royal Mail Tracked 24',
          carrier: 'Royal Mail',
          service: 'tracked24',
          cost: 6.45,
          conditions: [
            {
              type: 'weight',
              value: 2,
              operator: 'lte',
            },
          ],
        },
      ],
    },
    {
      id: '3',
      name: 'European Union',
      countries: ['FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'PT', 'IE'],
      regions: [],
      postcodes: [],
      methods: [
        {
          id: '6',
          name: 'Royal Mail International Standard',
          carrier: 'Royal Mail',
          service: 'internationalStandard',
          zone: 'europeanZone',
          cost: 10.55,
          conditions: [
            {
              type: 'weight',
              value: 2,
              operator: 'lte',
            },
          ],
        },
        {
          id: '7',
          name: 'Royal Mail International Tracked',
          carrier: 'Royal Mail',
          service: 'internationalTracked',
          zone: 'europeanZone',
          cost: 13.95,
          conditions: [
            {
              type: 'weight',
              value: 2,
              operator: 'lte',
            },
          ],
        },
      ],
    },
  ],
  rules: [
    {
      id: '1',
      name: 'Free UK Delivery Over £50',
      priority: 1,
      conditions: [
        {
          type: 'price',
          operator: 'gt',
          value: 50,
          zone: '1',
        },
      ],
      actions: [
        {
          type: 'free_shipping',
          value: 0,
        },
      ],
      active: true,
    },
    {
      id: '2',
      name: 'Heavy Item Surcharge',
      priority: 2,
      conditions: [
        {
          type: 'weight',
          operator: 'gt',
          value: 5,
        },
      ],
      actions: [
        {
          type: 'fixed_rate',
          value: 5,
        },
      ],
      active: true,
    },
  ],
  labelSettings: {
    paperSize: 'A4',
    labelFormat: 'PDF',
    defaultService: 'standard',
    autoGenerate: true,
    autoManifest: true,
    manifestTime: '17:00',
    returnAddress: {
      name: 'Wick & Wax Co',
      company: 'Wick & Wax Co Ltd',
      street: '123 Candle Street',
      city: 'London',
      postcode: 'SW1A 1AA',
      country: 'GB',
      phone: '+44 20 1234 5678',
    },
    customizations: {
      logo: true,
      qrCode: true,
      orderNumber: true,
      customMessage: 'Thank you for shopping with Wick & Wax Co!',
    },
  },
};

export const shippingHandlers = [
  graphql.query('GetShippingSettings', () => {
    return HttpResponse.json({
      data: {
        shippingSettings,
      },
    });
  }),

  graphql.mutation('UpdateShippingSettings', ({ variables }) => {
    const { input } = variables;
    Object.assign(shippingSettings.royalMail, input.royalMail);
    return HttpResponse.json({
      data: {
        updateShippingSettings: {
          royalMail: shippingSettings.royalMail,
        },
      },
    });
  }),

  graphql.mutation('UpdateShippingZone', ({ variables }) => {
    const { id, input } = variables;
    const zoneIndex = shippingSettings.zones.findIndex(zone => zone.id === id);
    if (zoneIndex === -1) {
      return HttpResponse.json(
        { errors: [{ message: 'Zone not found' }] },
        { status: 404 }
      );
    }
    shippingSettings.zones[zoneIndex] = {
      ...shippingSettings.zones[zoneIndex],
      ...input,
    };
    return HttpResponse.json({
      data: {
        updateShippingZone: shippingSettings.zones[zoneIndex],
      },
    });
  }),

  graphql.mutation('DeleteShippingZone', ({ variables }) => {
    const { id } = variables;
    const zoneIndex = shippingSettings.zones.findIndex(zone => zone.id === id);
    if (zoneIndex === -1) {
      return HttpResponse.json(
        { errors: [{ message: 'Zone not found' }] },
        { status: 404 }
      );
    }
    shippingSettings.zones.splice(zoneIndex, 1);
    return HttpResponse.json({
      data: {
        deleteShippingZone: { id },
      },
    });
  }),

  graphql.mutation('CreateShippingZone', ({ variables }) => {
    const { input } = variables;
    const newZone = {
      id: String(shippingSettings.zones.length + 1),
      ...input,
    };
    shippingSettings.zones.push(newZone);
    return HttpResponse.json({
      data: {
        createShippingZone: newZone,
      },
    });
  }),

  graphql.mutation('UpdateLabelSettings', ({ variables }) => {
    const { input } = variables;
    Object.assign(shippingSettings.labelSettings, input);
    return HttpResponse.json({
      data: {
        updateLabelSettings: shippingSettings.labelSettings,
      },
    });
  }),
];
